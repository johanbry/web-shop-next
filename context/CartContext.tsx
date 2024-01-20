"use client";

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
} from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  IAggregatedProduct,
  ICartContext,
  ICartItem,
  IMainProduct,
  IProductCombination,
  IProductStyleOption,
  ISelectedProductIds,
} from "../interfaces/interfaces";
import { fetchProduct, fetchProductByPId } from "@/actions/product";

const defaultValues = {
  cartItems: [],
  addToCart: () => {},
  subtractFromCart: () => {},
  clearCart: () => {},
  qtyInCart: () => {
    return 0;
  },
  cartTotal: () => {
    return 0;
  },
};

export const CartContext = createContext<ICartContext>(defaultValues);

export const useCartContext = () => useContext(CartContext);

const CartProvider = ({ children }: PropsWithChildren) => {
  const [cartItems, setCartItems] = useLocalStorage<ICartItem[]>("cart", []);

  const addToCart = async (
    productIds: ISelectedProductIds,
    quantity: number
  ) => {
    const product: IAggregatedProduct = await fetchProduct(
      productIds.product_id,
      productIds.style_id,
      productIds.combination_id
    );

    console.log("product", product);

    /* const product: IMainProduct | null = await fetchProductByPId(
      productIds.product_id
    );*/
    /*     let stock: number;
    let price: number;
    let image: string | undefined;
    let options: string | undefined = undefined; */

    if (!product) return;

    const stock = product.stock;
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

    const itemIndex = cartItems.findIndex(
      (item: ICartItem) =>
        item.product_id === productIds.product_id &&
        item.style_id === productIds.style_id &&
        item.combination_id === productIds.combination_id
    );

    if (itemIndex === -1) {
      if (stock < quantity) {
        console.log("Not enough stock");
        // Notification
        return;
      }
      const cartItem: ICartItem = {
        product_id: productIds.product_id,
        style_id: productIds.style_id,
        combination_id: productIds.combination_id,
        name: product.name,
        options: options ? options : undefined,
        price: price,
        quantity: quantity,
        image: image,
      };
      setCartItems([...cartItems, { ...cartItem, quantity }]);
    } else {
      if (stock < quantity + cartItems[itemIndex].quantity) {
        console.log("Not enough stock");
        // Notification
        return;
      }
      const newCartItems = [...cartItems];
      newCartItems[itemIndex].quantity += quantity;
      setCartItems(newCartItems);
    }

    /*     const itemIndex = cartItems.findIndex(
      (item: ICartItem) =>
        item.product_id === cartItem.product_id &&
        item.style_id === cartItem.style_id &&
        item.combination_id === cartItem.combination_id
    );

    if (itemIndex === -1)
      setCartItems([...cartItems, { ...cartItem, quantity }]);
    else {
      const newCartItems = [...cartItems];
      newCartItems[itemIndex].quantity += quantity;
      setCartItems(newCartItems);
    } */
  };

  const subtractFromCart = (cartItem: any, quantity: number) => {
    const itemIndex = cartItems.findIndex(
      (item: ICartItem) =>
        item.product_id === cartItem.product_id &&
        item.style_id === cartItem.style_id &&
        item.combination_id === cartItem.combination_id
    );
    if (itemIndex === -1) return;

    const newCartItems = [...cartItems];

    if (cartItems[itemIndex].quantity <= quantity)
      newCartItems.splice(itemIndex, 1);
    else newCartItems[itemIndex].quantity -= quantity;

    setCartItems(newCartItems);
  };

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, [setCartItems]);

  const qtyInCart = () => {
    return cartItems.reduce(
      (sum: number, item: ICartItem) => sum + item.quantity,
      0
    );
  };

  const cartTotal = () => {
    return cartItems.reduce(
      (sum: number, item: ICartItem) => sum + item.quantity * item.price,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        subtractFromCart,
        clearCart,
        qtyInCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
