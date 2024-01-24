"use client";

import {
  Box,
  Title,
  Text,
  Group,
  Loader,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  Button,
  Center,
  Alert,
} from "@mantine/core";
import CartItemsList from "../cart/cart-items-list";
import { useCartContext } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { IShippingMethod } from "@/interfaces/interfaces";
import { validateCartStock } from "@/actions/product";
import { showNotification } from "@/utils/showNotifications";
import { IconInfoCircle } from "@tabler/icons-react";
import { set } from "mongoose";

type Props = {
  shippingMethods: IShippingMethod[];
};

const Checkout = ({ shippingMethods }: Props) => {
  const { cartItems, cartTotal, cartWeight, subtractFromCart } =
    useCartContext();
  const [isClient, setIsClient] = useState(false);
  const [selectedShippingIndex, setSelectedShippingIndex] = useState(0);
  const [validateStockErrorMessage, setValidateStockErrorMessage] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const cartTotAmount = cartTotal();
  const cartTotWeight = cartWeight();

  //Filter shipping methods based on cart amount and weight
  let filteredShippingMethods = shippingMethods.filter((method) => {
    if (method.min_amount && method.min_amount > cartTotAmount) return false;
    if (method.max_amount && method.max_amount < cartTotAmount) return false;
    if (method.min_weight && method.min_weight > cartTotWeight) return false;
    if (method.max_weight && method.max_weight < cartTotWeight) return false;
    return true;
  });

  //Check if free shipping is applicable and set price to 0 for each shipping method
  filteredShippingMethods = filteredShippingMethods.map((method) => {
    let price = method.price;
    if (method.free_amount && method.free_amount < cartTotAmount) price = 0;
    return {
      ...method,
      price,
    };
  });

  //Sort shipping methods by price
  filteredShippingMethods.sort((a, b) => a.price - b.price);

  const shippingCost =
    filteredShippingMethods[selectedShippingIndex].price || 0;
  const totalToPay = cartTotAmount + shippingCost;

  const handleCheckoutClick = async () => {
    setIsLoading(true);
    const validateResponse = await validateCartStock(cartItems);
    if (!validateResponse.valid) {
      const invalidItems = validateResponse.invalidItems;
      invalidItems?.forEach((item) => {
        subtractFromCart(item, item.stockDiff);
      });
      setValidateStockErrorMessage(
        `Tyvärr tvingades vi göra justeringar i din varukorg då vi har för lågt lagersaldo på dessa varor: ${invalidItems
          ?.map((item) => item.name)
          .join(
            ", "
          )}. Vänligen kontrollera din varukorg innan du fortsätter till betalning.`
      );
      setIsLoading(false);
    } else {
      //TODO: Checkout
      setIsLoading(false);
    }
  };

  //Avoid hydration error
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {!isClient ? (
        <Text>
          <Loader />
        </Text>
      ) : (
        cartItems.length > 0 && (
          <>
            <Title order={3}>1. Varukorg</Title>
            <Paper radius={5} shadow="xs" p="sm" mt="sm" mb="xl">
              <CartItemsList cartItems={cartItems} />
              <Box w="100%">
                <Text fw="bold" mt="sm" style={{ textAlign: "right" }}>
                  Frakt: {shippingCost} kr
                </Text>
                <Text fw="bold" mt="sm" style={{ textAlign: "right" }}>
                  Totalt att betala: {totalToPay} kr
                </Text>
              </Box>
            </Paper>

            <Title order={3}>2. Fraktsätt</Title>
            <Paper radius={5} shadow="xs" p="sm" mt="sm" mb="xl">
              <RadioGroup
                value={filteredShippingMethods[
                  selectedShippingIndex
                ]._id.toString()}
              >
                <Stack>
                  {filteredShippingMethods.map((method, index) => (
                    <Box
                      key={method._id.toString()}
                      onClick={() => setSelectedShippingIndex(index)}
                      style={{ cursor: "pointer" }}
                    >
                      <Group justify="spacebetween" align="baseline">
                        <Box>
                          <Radio value={method._id.toString()} />
                        </Box>
                        <Box flex={1}>
                          <Title order={5}>
                            {method.name}
                            {method.free_amount && (
                              <Text component="span">
                                {" "}
                                - fri frakt över {method.free_amount} kr
                              </Text>
                            )}
                          </Title>
                          <Text size="sm">{method.description}</Text>
                        </Box>
                        <Box>
                          <Text fw="bold">{method.price} kr</Text>
                        </Box>
                      </Group>
                      {index < filteredShippingMethods.length - 1 && (
                        <Divider mt="xs" />
                      )}
                    </Box>
                  ))}
                </Stack>
              </RadioGroup>
            </Paper>
            {filteredShippingMethods && filteredShippingMethods.length > 0 && (
              <>
                {validateStockErrorMessage && (
                  <Center mb="lg">
                    <Alert
                      onClose={() => setValidateStockErrorMessage(null)}
                      variant="light"
                      color="red"
                      withCloseButton
                      title="Problem med lagersaldo"
                      icon={<IconInfoCircle />}
                    >
                      {validateStockErrorMessage}
                    </Alert>
                  </Center>
                )}
                <Center>
                  <Button
                    w={300}
                    size="xl"
                    onClick={handleCheckoutClick}
                    color="var(--mantine-color-green-6)"
                    aria-disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader
                        color="var(--mantine-color-white)"
                        size="sm"
                        ml="sm"
                      />
                    ) : (
                      "Fortsätt till betalning"
                    )}
                  </Button>
                </Center>
              </>
            )}
          </>
        )
      )}
      {isClient && cartItems.length === 0 && <Text>Din varukorg är tom</Text>}
    </>
  );
};

export default Checkout;
