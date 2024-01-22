import { useCartContext } from "@/context/CartContext";
import { ICartItem } from "@/interfaces/interfaces";
import { PRODUCT_IMAGES_PATH } from "@/utils/constants";
import {
  ActionIcon,
  AspectRatio,
  Box,
  Button,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCircleMinus,
  IconCirclePlus,
  IconMoodSmile,
  IconPhoto,
  IconTrashX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import CartItemsList from "./cart-items-list";

type Props = {};

const CartDrawer = (props: Props) => {
  const {
    cartItems,
    cartTotal,
    cartOpened,
    toggleCart,
    addToCart,
    subtractFromCart,
  } = useCartContext();
  const router = useRouter();
  const imagesPath = PRODUCT_IMAGES_PATH;

  const handleCheckoutClick = () => {
    toggleCart();
    router.push("/kassa");
  };
  return (
    <Drawer
      opened={cartOpened}
      onClose={toggleCart}
      position="right"
      title="Din varukorg"
    >
      <Group>
        <Divider w="100%" />
        {!cartItems.length && (
          <>
            <Text my="xl" mx="xs">
              Varukorgen är tom, men det behöver den inte vara...
            </Text>
          </>
        )}

        {cartItems.length > 0 && <CartItemsList cartItems={cartItems} />}

        {cartItems.length > 0 && (
          <>
            <Box w="100%">
              <Text fw="bold" mt="sm" style={{ textAlign: "right" }}>
                Totalsumma: {cartTotal()} kr
              </Text>
            </Box>
            <Divider w="100%" mb="lg" />

            <Button size="xl" fullWidth onClick={handleCheckoutClick}>
              Gå till kassan
            </Button>
          </>
        )}
        <Button variant="outline" size="xl" fullWidth onClick={toggleCart}>
          Fortsätt handla
        </Button>
      </Group>
    </Drawer>
  );
};

export default CartDrawer;
