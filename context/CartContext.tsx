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
  ISelectedProductIds,
} from "../interfaces/interfaces";
import { fetchProduct } from "@/actions/product";

import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@/utils/showNotifications";

const defaultValues = {
  cartItems: [],
  cartOpened: false,
  toggleCart: () => {},
  addToCart: () => {},
  subtractFromCart: () => {},
  clearCart: () => {},
  qtyInCart: () => {
    return 0;
  },
  cartTotal: () => {
    return 0;
  },
  cartWeight: () => {
    return 0;
  },
};

export const CartContext = createContext<ICartContext>(defaultValues);

export const useCartContext = () => useContext(CartContext);

const CartProvider = ({ children }: PropsWithChildren) => {
  const [cartItems, setCartItems] = useLocalStorage<ICartItem[]>("cart", []);
  const [cartOpened, { toggle: toggleCart }] = useDisclosure(false);

  const addToCart = async (
    productIds: ISelectedProductIds,
    quantity: number,
    showDrawer: boolean = false
  ) => {
    let product: IAggregatedProduct;
    try {
      product = await fetchProduct(
        productIds.product_id,
        productIds.style_id,
        productIds.combination_id
      );
    } catch (error) {
      console.log(error);
      showNotification(
        "Kunde inte lägga i varukorgen",
        "Ett fel uppstod, vänligen försök igen!",
        "error"
      );
      return;
    }

    if (!product) {
      showNotification(
        "Kunde inte lägga i varukorgen",
        "Ett fel uppstod, vänligen försök igen!",
        "error"
      );
      return;
    }

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
      //New cart item
      if (stock < quantity) {
        showNotification(
          "Kunde inte lägga i varukorgen",
          "Tyvärr finns inte produkten i lager!",
          "error"
        );
        return;
      }
      const cartItem: ICartItem = {
        product_id: productIds.product_id,
        style_id: productIds.style_id,
        combination_id: productIds.combination_id,
        name: product.name,
        options: options ? options : undefined,
        price: price,
        weight: product.weight || 0,
        quantity: quantity,
        image: image,
      };
      setCartItems([...cartItems, { ...cartItem, quantity }]);
    } else {
      //Update existing cart item
      if (stock < quantity + cartItems[itemIndex].quantity) {
        showNotification(
          "Kunde inte lägga lägga till fler",
          "Tyvärr har vi inte fler i lager!",
          "error"
        );
        return;
      }
      const newCartItems = [...cartItems];
      newCartItems[itemIndex].quantity += quantity;
      setCartItems(newCartItems);
    }
    if (showDrawer) toggleCart();
  };

  const subtractFromCart = (cartItem: ICartItem, quantity: number) => {
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

  const cartWeight = () => {
    return cartItems.reduce(
      (sum: number, item: ICartItem) => sum + item.quantity * item.weight,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartOpened,
        toggleCart,
        addToCart,
        subtractFromCart,
        clearCart,
        qtyInCart,
        cartTotal,
        cartWeight,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
