import Order from "@/models/Order";
import { Text, Container } from "@mantine/core";
import { Metadata } from "next";
import { IOrder } from "@/interfaces/interfaces";
import OrderConfirmation from "@/app/components/order/order-confirmation";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Orderbekräftelse",
};

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Props) {
  const stripeSessionId = searchParams?.session_id;
  if (!stripeSessionId) redirect("/");
  const order: IOrder | null = await Order.findOne({
    payment_reference: stripeSessionId,
  });
  if (!order) redirect("/");

  return (
    <Container size="sm" px={0}>
      {order && order.payment_status === "paid" && (
        <OrderConfirmation order={JSON.parse(JSON.stringify(order))} />
      )}
      {order && order.payment_status !== "paid" && (
        <Text>Någonting gick fel, betalningen är inte genomförd.</Text>
      )}
    </Container>
  );
}
