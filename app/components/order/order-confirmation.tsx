"use client";

import { useCartContext } from "@/context/CartContext";
import { IOrder } from "@/interfaces/interfaces";
import { Title, Text, Paper, Stack, Divider } from "@mantine/core";
import { useEffect } from "react";
import OrderSummary from "./order-summary";
import OrderSummaryHeader from "./order-summary-header";
import OrderSummaryContent from "./order-summary-content";

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
      <Paper radius={5} shadow="xs" p="sm" mt="sm" mb="xl">
        <Stack>
          <OrderSummaryHeader
            orderId={order.order_id}
            createdAt={order.createdAt}
          />
          <Divider size="sm" />
          <OrderSummaryContent order={order} />
        </Stack>
      </Paper>
    </>
  );
};

export default OrderConfirmation;
