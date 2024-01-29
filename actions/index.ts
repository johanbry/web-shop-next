"use server";

import {
  CreateUserInput,
  CreateUserValidationSchema,
  IAggregatedListProduct,
  IAggregatedProduct,
  ICartItem,
  IMainProduct,
  IOrderItem,
  ISessionUser,
  IShippingMethod,
  IShippingMethodOrder,
} from "@/interfaces/interfaces";
import {
  getProduct,
  getProductById,
  getProducts,
  updateStock,
} from "@/lib/product";
import Order from "@/models/Order";
import initStripe from "@/utils/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { IUser } from "@/interfaces/interfaces";
import connectToDB from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Fetches products from the server.
 *
 * @param offset - The offset for pagination.
 * @param limit - The maximum number of products to fetch.
 * @param categoryId - The ID of the category to filter by.
 * @param sortOrder - The sort order for the products.
 * @param searchTerm - The search term to filter products by.
 * @returns A promise that resolves to an array of products.
 */
export const fetchProducts = async (
  offset: number = 0,
  limit: number = 2,
  categoryId?: string,
  sortOrder?: string,
  searchTerm?: string
) => {
  const products: IAggregatedListProduct[] = await getProducts(
    offset,
    limit,
    categoryId
  );
  return products || [];
};

/**
 * Fetches a product by its product ID.
 * @param productId - The ID of the product to fetch.
 * @returns A promise that resolves to the fetched product.
 */
export const fetchProductByPId = async (productId: string) => {
  const product: IMainProduct | null = await getProductById(productId);
  return product;
};

/**
 * Fetches a product by its product ID, style ID and combination ID.
 * @param productId - The ID of the product to fetch.
 * @returns A promise that resolves to the fetched product.
 */
export const fetchProduct = async (
  productId: string,
  styleId?: string | undefined,
  combinationId?: string | undefined
) => {
  const product: IAggregatedProduct = await getProduct(
    productId,
    styleId,
    combinationId
  );
  return product;
};

/**
 * Validates the stock of items in the cart.
 * @param cartItems - An array of cart items.
 * @returns An object indicating whether the cart is valid and an array of invalid items if applicable.
 */
export const validateCartStock = async (cartItems: ICartItem[]) => {
  let invalidItems: any[] = [];
  try {
    for (let item of cartItems) {
      const product = await getProduct(
        item.product_id,
        item.style_id,
        item.combination_id
      );
      if (product) {
        if (product.stock < item.quantity) {
          const stock = product.stock < 0 ? 0 : product.stock;
          invalidItems.push({ ...item, stockDiff: item.quantity - stock });
        }
      }
    }
  } catch (error) {
    return { valid: true }; //If the check couldn't be performed we let the order through (or should we not?)
  }
  if (invalidItems.length === 0) {
    return { valid: true };
  }
  return { valid: false, invalidItems };
};

/**
 * Creates order (draft), initializes and redirect to Stripe payment.
 *
 * @param cartItems - The items in the cart.
 * @param shippingMethod - The selected shipping method.
 * @returns An object with the created order information or an error message.
 */
export const createAndPayOrder = async (
  cartItems: ICartItem[],
  shippingMethod: IShippingMethod
) => {
  let orderItems: IOrderItem[] = [];
  let orderShippingMethod: IShippingMethodOrder = {
    name: shippingMethod.name,
    price: shippingMethod.price,
  };
  const orderStatus = "draft";
  const orderPaymentStatus = "unpaid";

  const host = headers().get("origin");
  let stripeSession: Stripe.Response<Stripe.Checkout.Session> | undefined;

  let loggedInUserId: string | undefined = undefined;
  let loggedInUserEmail: string | undefined = undefined;

  const session = (await getServerSession(authOptions)) as unknown as {
    user: ISessionUser;
  };

  if (session) {
    loggedInUserId = session.user.id;
    loggedInUserEmail = session.user.email;
  }

  //Get product items from db to ensure we have the latest info and for security reasons and create order items
  try {
    orderItems = await Promise.all(
      cartItems.map(async (cartItem) => {
        const product: IAggregatedProduct = await getProduct(
          cartItem.product_id,
          cartItem.style_id,
          cartItem.combination_id
        );

        const price = product.price;
        let image =
          product.images && product.images[0] && product.images[0].filename;
        let options: string | undefined = undefined;
        let styleOption: string | undefined = undefined;
        let combinationOption: string | undefined = undefined;

        if (
          product.product_type === "style" ||
          product.product_type === "style-combination"
        ) {
          image =
            product.style_product?.images &&
            product.style_product.images[0] &&
            product.style_product.images[0].filename;

          styleOption = `${product.style_options?.type}: ${product.style_product?.name}`;
        }

        if (
          product.product_type === "combination" ||
          product.product_type === "style-combination"
        ) {
          combinationOption = `${product.variant?.type}: ${product.combination_product?.variant_name}`;
        }

        options = [styleOption, combinationOption].filter(Boolean).join(", ");
        if (options.length > 0) options = `(${options})`;

        const orderItem: IOrderItem = {
          product_id: cartItem.product_id,
          style_id: cartItem.style_id,
          combination_id: cartItem.combination_id,
          name: product.name,
          options: options ? options : undefined,
          price: price,
          weight: product.weight || 0,
          quantity: cartItem.quantity,
          image: image,
        };

        return orderItem;
      })
    );
  } catch (error) {
    console.log(error);
    return { error: "Order kunde inte skapas." };
  }

  //Create stripe checkout session
  try {
    const stripe = initStripe();
    stripeSession = await stripe?.checkout.sessions.create({
      line_items: orderItems.map((item: IOrderItem) => {
        return {
          price_data: {
            currency: "sek",
            product_data: {
              name: item.name + (item.options ? ` ${item.options}` : ""),
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["SE"],
      },
      phone_number_collection: {
        enabled: true,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: orderShippingMethod.name,
            type: "fixed_amount",
            fixed_amount: {
              amount: orderShippingMethod.price * 100,
              currency: "sek",
            },
          },
        },
      ],
      customer_email: loggedInUserEmail || undefined,
      expires_at: Math.floor(Date.now() / 1000) + 3600 / 2, //Expire session in 30 minutes to return back stock
      success_url: `${host}/orderbekraftelse?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${host}/kassa`,
    });

    if (!stripeSession || !stripeSession.id || !stripeSession.url) {
      throw new Error();
    }
  } catch (err) {
    console.error(err);
    return { error: "Någonting gick fel med betalningen." };
  }

  try {
    await Order.create({
      items: orderItems,
      shipping_method: orderShippingMethod,
      status: orderStatus,
      payment_status: orderPaymentStatus,
      payment_reference: stripeSession.id,
      user_id: loggedInUserId,
    });
  } catch (error) {
    console.log(error);
    return { error: "Order kunde inte skapas." };
  }

  //Reserve products by reducing stock
  orderItems.forEach(async (item) => {
    updateStock(
      {
        product_id: item.product_id,
        style_id: item.style_id,
        combination_id: item.combination_id,
      },
      -Math.abs(item.quantity) //Negative to subtract quantity
    );
  });

  return { success: true, stripe_url: stripeSession.url };
};

/**
 * Creates a new user.
 * @param newUser - The user data for the new user.
 * @returns An object containing the created user or any errors that occurred during the creation process.
 */
export const createUser = async (newUser: CreateUserInput) => {
  const result = CreateUserValidationSchema.safeParse(newUser);
  if (!result.success) {
    return {
      fieldErrors: result.error.formErrors.fieldErrors,
    };
  }

  try {
    const userExists = await User.findOne({ email: result.data.email });
    if (userExists) {
      return { error: "Användare finns redan" };
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10);
    await connectToDB();
    const user: IUser = await User.create({
      name: result.data.name,
      email: result.data.email,
      password: hashedPassword,
      role: "customer",
    });
    delete user.password;
    return { user: JSON.parse(JSON.stringify(user)) as IUser };
  } catch (error) {
    return { error: "Kontot kunde inte skapas, någonting gick fel" };
  }
};
