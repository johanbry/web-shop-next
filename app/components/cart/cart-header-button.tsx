"use client";

import { useCartContext } from "@/context/CartContext";
import { ActionIcon, Box, Indicator } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";
import { use, useEffect, useState } from "react";

type Props = {};

const CartHeaderIcon = (props: Props) => {
  const { cartItems, toggleCart, qtyInCart } = useCartContext();
  const [indicatorDisabled, setIndicatorDisabled] = useState(true);
  const [indicatorLabel, setIndicatorLabel] = useState<string | null>(null);

  //UseEffect needed to avoid hydration error because of server side rendering and local storage
  useEffect(() => {
    setIndicatorDisabled(cartItems.length < 1);
    setIndicatorLabel(qtyInCart().toString());
  }, [cartItems, qtyInCart]);

  return (
    <Indicator
      disabled={indicatorDisabled}
      //inline
      offset={5}
      label={indicatorLabel}
      size="20"
    >
      <ActionIcon
        variant="transparent"
        size="lg"
        color="black"
        onClick={toggleCart}
      >
        <IconShoppingCart style={{ width: "100%", height: "100%" }} />
      </ActionIcon>
    </Indicator>
  );
};

export default CartHeaderIcon;
