import { useCartContext } from "@/context/CartContext";

import {
  Box,
  Button,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import CartItemsList from "./cart-items-list";

type Props = {};

const CartDrawer = (props: Props) => {
  const { cartItems, cartTotal, cartOpened, toggleCart } = useCartContext();
  const router = useRouter();

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
      <Stack>
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
      </Stack>
    </Drawer>
  );
};

export default CartDrawer;
