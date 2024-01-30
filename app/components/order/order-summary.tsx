"use client";

import Image from "next/image";
import { IOrder } from "@/interfaces/interfaces";
import {
  Container,
  Title,
  Text,
  AspectRatio,
  Box,
  Divider,
  Group,
  Stack,
  Paper,
  Flex,
} from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { Fragment } from "react";
import { PRODUCT_IMAGES_PATH } from "@/utils/constants";
import { formatDate } from "@/utils/helpers";

type Props = {
  order: IOrder;
};

const OrderSummary = ({ order }: Props) => {
  const imagesPath = PRODUCT_IMAGES_PATH;

  const productTotal = order.items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  const orderTotal = productTotal + order.shipping_method.price;

  return (
    <Paper radius={5} shadow="xs" p="sm" mt="sm" mb="xl">
      <Stack>
        <Box>
          <Title order={4}>Ordernummer: {order.order_id}</Title>
          <Text component="span" size="sm">
            Datum: {formatDate(order.createdAt)}
          </Text>
        </Box>
        <Divider size="sm" />
        {order.items.map((item, index) => (
          <Fragment key={index}>
            <Box w="100%">
              <Group justify="space-between">
                <Box w={60}>
                  <AspectRatio ratio={1 / 1}>
                    {item.image ? (
                      <Image
                        style={{ objectFit: "contain" }}
                        fill
                        src={`${imagesPath}/${item.image}`}
                        alt={item.name}
                        sizes="(max-width: 768px) 25vw, (max-width: 1200px) 15vw, 8vw"
                      />
                    ) : (
                      <IconPhoto color="var(--mantine-color-gray-1)" />
                    )}
                  </AspectRatio>
                </Box>
                <Stack flex={1} gap={2}>
                  <Title order={5}>{item.name}</Title>
                  <Text size="sm">{item.options}</Text>
                </Stack>
                <Stack align="flex-end" gap={2}>
                  <Text fw="bold">{item.price * item.quantity} kr</Text>
                  <Text size="sm" fw="normal">
                    {item.quantity} x {item.price} kr
                  </Text>
                </Stack>
              </Group>
            </Box>
            <Divider w="100%" />
          </Fragment>
        ))}
        <Box w="100%">
          <Text fw="normal" mt="sm" style={{ textAlign: "right" }} size="sm">
            Frakt ({order.shipping_method.name}): {order.shipping_method.price}
            kr
          </Text>
          <Text fw="bold" mt="sm" style={{ textAlign: "right" }}>
            Totalt: {orderTotal} kr
          </Text>
        </Box>
        <Divider size="sm" />
        <Flex justify="space-between" wrap="wrap" gap="sm">
          <Stack gap={2}>
            <Title order={4}>Leveransadress</Title>
            <Text component="span" size="sm">
              {order.delivery_address?.name}
            </Text>
            <Text component="span" size="sm">
              {order.delivery_address?.street}
            </Text>
            {order.delivery_address?.street2 && (
              <Text component="span" size="sm">
                {order.delivery_address?.street2}
              </Text>
            )}
            <Text component="span" size="sm">
              {order.delivery_address?.zipcode} {order.delivery_address?.city}
            </Text>
          </Stack>
          <Stack gap={2} mr="sm">
            <Title order={4}>Kontaktuppgifter</Title>
            <Text size="sm">E-post: {order.customer_email}</Text>
            <Text size="sm">Telefon: {order.customer_phone}</Text>
          </Stack>
        </Flex>
      </Stack>
    </Paper>
  );
};

export default OrderSummary;
