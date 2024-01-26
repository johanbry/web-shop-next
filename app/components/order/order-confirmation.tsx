"use client";

import { useCartContext } from "@/context/CartContext";
import { IOrder } from "@/interfaces/interfaces";
import { Title, Text } from "@mantine/core";
import { useEffect } from "react";
import OrderSummary from "./order-summary";

type Props = {
  order: IOrder;
};

const OrderConfirmation = ({ order }: Props) => {
  const { clearCart } = useCartContext();

  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return (
    <>
      <Title order={2}>Tack för din beställning!</Title>
      <Text>Här är en sammanställning av din beställning.</Text>
      <OrderSummary order={order} />
    </>
  );
};

export default OrderConfirmation;
