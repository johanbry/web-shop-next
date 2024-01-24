"use server";

import {
  IAggregatedListProduct,
  IAggregatedProduct,
  ICartItem,
  IMainProduct,
  IOrderItem,
  IShippingMethod,
} from "@/interfaces/interfaces";
import { getProduct, getProductById, getProducts } from "@/lib/product";
import Order from "@/models/Order";

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

export const createAndPayOrder = async (
  cartItems: ICartItem[],
  shippingMethod: IShippingMethod
) => {
  try {
    //Get product items from db to ensure we have the latest info and for security reasons
    // Create order items
    const orderItems: IOrderItem[] = await Promise.all(
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

        options = `${styleOption || ""}${
          styleOption && combinationOption ? "," : ""
        }  ${combinationOption || ""}`;

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
    const orderShippingMethod = {
      name: shippingMethod.name,
      price: shippingMethod.price,
    };

    const orderStatus = "draft";
    const orderPaymentStatus = "unpaid";
    console.log("orderShippingMethod: ", orderShippingMethod);

    console.log("orderItems: ", orderItems);

    await Order.create({
      items: orderItems,
      shipping_method: orderShippingMethod,
      status: orderStatus,
      payment_status: orderPaymentStatus,
    });
  } catch (error) {
    console.log(error);
  }
};
