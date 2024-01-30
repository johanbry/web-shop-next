import { Box, Center, Divider, NavLink, Stack, Text } from "@mantine/core";
import {
  IconBarcode,
  IconCategory,
  IconChevronRight,
  IconFileStack,
  IconHome,
  IconShoppingCart,
  IconTruckDelivery,
  IconUsers,
} from "@tabler/icons-react";
import SignoutButton from "../auth/signout-button";

type Props = {
  userInfo: string | undefined | null;
};

const NavbarMenu = ({ userInfo }: Props) => {
  return (
    <Box>
      <Divider />
      <NavLink
        href="/admin/ordrar"
        label="Beställningar"
        leftSection={<IconShoppingCart size="1.2rem" />}
        rightSection={
          <IconChevronRight
            size="0.8rem"
            stroke={1.5}
            className="mantine-rotate-rtl"
          />
        }
      />
      <Divider />
      <NavLink
        href="/admin/kategorier"
        label="Kategorier"
        leftSection={<IconCategory size="1.2rem" />}
        rightSection={
          <IconChevronRight
            size="0.8rem"
            stroke={1.5}
            className="mantine-rotate-rtl"
          />
        }
      />
      <Divider />
      <NavLink
        href="/admin/produkter"
        label="Produkter"
        leftSection={<IconBarcode size="1.2rem" />}
        rightSection={
          <IconChevronRight
            size="0.8rem"
            stroke={1.5}
            className="mantine-rotate-rtl"
          />
        }
      />
      <Divider />
      <NavLink
        href="/admin/fraktsatt"
        label="Fraktsätt"
        leftSection={<IconTruckDelivery size="1.2rem" />}
        rightSection={
          <IconChevronRight
            size="0.8rem"
            stroke={1.5}
            className="mantine-rotate-rtl"
          />
        }
      />
      <Divider />
      <NavLink
        href="/admin/sidor"
        label="Sidor"
        leftSection={<IconFileStack size="1.2rem" />}
        rightSection={
          <IconChevronRight
            size="0.8rem"
            stroke={1.5}
            className="mantine-rotate-rtl"
          />
        }
      />
      <Divider />
      <NavLink
        href="/admin/anvandare"
        label="Användare"
        leftSection={<IconUsers size="1.2rem" />}
        rightSection={
          <IconChevronRight
            size="0.8rem"
            stroke={1.5}
            className="mantine-rotate-rtl"
          />
        }
      />
      <Divider mb="xl" />
      <Center>
        <Stack hiddenFrom="sm" w={180} align="center">
          <Text size="sm">Inloggad som {userInfo}</Text>
          <SignoutButton />
        </Stack>
      </Center>
    </Box>
  );
};

export default NavbarMenu;
