import { useCartContext } from "@/context/CartContext";
import Order from "@/models/Order";

import { Text, Container, Title } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orderbekräftelse",
};

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Props) {
  const stripeSessionId = searchParams?.session_id;
  const order = await Order.findOne({ payment_reference: stripeSessionId });
  console.log("order", order);

  return (
    <Container size="lg" px={0}>
      <Title order={2} mb="lg">
        Tack för din order!
      </Title>
      <Text>{JSON.stringify(order)}</Text>
    </Container>
  );
}
