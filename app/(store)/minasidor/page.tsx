import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignoutButton from "@/app/components/auth/signout-button";
import OrderStatus from "@/app/components/order/order-status";
import OrderSummaryContent from "@/app/components/order/order-summary-content";
import OrderSummaryHeader from "@/app/components/order/order-summary-header";
import { IOrder, ISessionUser } from "@/interfaces/interfaces";
import { getOrdersByUserId } from "@/lib/order";
import {
  Text,
  Container,
  Title,
  Button,
  Group,
  Box,
  Accordion,
  Divider,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
  Paper,
  Stack,
} from "@mantine/core";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Mina sidor",
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  const user = session?.user as ISessionUser;

  let orders: IOrder[] = await getOrdersByUserId(user.id);
  orders = orders.filter((order) => order.payment_status === "paid");

  if (!session) redirect("/loggain");
  return (
    <Container size="lg" px={0}>
      <Group justify="space-between">
        <Title>Mina sidor</Title>

        <SignoutButton />
      </Group>
      <Text my="lg">
        Inloggad som {user?.name} ({user?.email})
      </Text>
      <Title order={3}>Mina beställningar</Title>
      {orders?.length > 0 ? (
        <Accordion>
          {orders?.map((order) => (
            <Paper
              radius={5}
              shadow="xs"
              p="sm"
              mt="sm"
              mb="xl"
              key={order.order_id}
            >
              <AccordionItem value={order.order_id}>
                <AccordionControl>
                  <OrderSummaryHeader
                    orderId={order.order_id}
                    createdAt={order.createdAt}
                  />
                </AccordionControl>
                <AccordionPanel>
                  <Stack>
                    <OrderStatus status={order.status || ""} />
                    <Divider />
                    <OrderSummaryContent order={order} />
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            </Paper>
          ))}
        </Accordion>
      ) : (
        <Text>Det finns inga beställningar att visa.</Text>
      )}
    </Container>
  );
}
