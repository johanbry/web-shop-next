import Checkout from "@/app/components/checkout/checkout";
import { useCartContext } from "@/context/CartContext";
import { getShippingMethods } from "@/lib/shippingmethod";
import { Box, Container, Title } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kassa",
};

export default async function Page() {
  const shippingMethods = await getShippingMethods();
  return (
    <Container size="sm" px={0}>
      <Title order={1} mb="lg">
        Kassa
      </Title>
      <Checkout shippingMethods={shippingMethods} />
    </Container>
  );
}
