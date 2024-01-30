"use client";

import { Text, Divider, Box } from "@mantine/core";

type Props = {
  status: string;
};

const OrderStatus = ({ status }: Props) => {
  return (
    <Box>
      <Text fw="bold" component="span">
        Status:
      </Text>{" "}
      {status}
    </Box>
  );
};

export default OrderStatus;
