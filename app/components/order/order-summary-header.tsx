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
  orderId: string;
  createdAt: string;
};

const OrderSummaryHeader = ({ orderId, createdAt }: Props) => {
  return (
    <Box>
      <Title order={4}>Ordernummer: {orderId}</Title>
      <Text component="span" size="sm">
        Datum: {formatDate(createdAt)}
      </Text>
    </Box>
  );
};

export default OrderSummaryHeader;
