import { ICartItem } from "@/interfaces/interfaces";
import {
  Box,
  Group,
  AspectRatio,
  Stack,
  Title,
  ActionIcon,
  Divider,
  Text,
} from "@mantine/core";
import {
  IconPhoto,
  IconCircleMinus,
  IconCirclePlus,
  IconTrashX,
} from "@tabler/icons-react";
import { Fragment } from "react";
import Image from "next/image";
import { useCartContext } from "@/context/CartContext";
import { PRODUCT_IMAGES_PATH } from "@/utils/constants";

type Props = {
  cartItems: ICartItem[];
};

const CartItemsList = ({ cartItems }: Props) => {
  const { cartTotal, toggleCart, addToCart, subtractFromCart } =
    useCartContext();
  const imagesPath = PRODUCT_IMAGES_PATH;
  return cartItems.map((item, index) => (
    <Fragment key={index}>
      <Box w="100%">
        <Group justify="space-between">
          <Box w={80}>
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
            <Group gap={4}>
              <ActionIcon
                variant="transparent"
                size="sm"
                onClick={() => subtractFromCart(item, 1)}
              >
                <IconCircleMinus color="var(--mantine-color-gray-6)" />
              </ActionIcon>
              <Text size="sm">{item.quantity} st</Text>
              <ActionIcon
                variant="transparent"
                size="sm"
                onClick={() =>
                  addToCart(
                    {
                      product_id: item.product_id,
                      style_id: item.style_id,
                      combination_id: item.combination_id,
                    },
                    1
                  )
                }
              >
                <IconCirclePlus color="var(--mantine-color-gray-6)" />
              </ActionIcon>
            </Group>
          </Stack>
          <Stack align="flex-end" gap={2} style={{ alignSelf: "flex-start" }}>
            <ActionIcon
              variant="transparent"
              size="sm"
              onClick={() => subtractFromCart(item, item.quantity)}
            >
              <IconTrashX color="var(--mantine-color-gray-5)" />
            </ActionIcon>
            <Text fw="bold">{item.price * item.quantity} kr</Text>
          </Stack>
        </Group>
      </Box>
      <Divider w="100%" />
    </Fragment>
  ));
};

export default CartItemsList;
