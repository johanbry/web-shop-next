"use client";

import {
  ActionIcon,
  Box,
  Burger,
  Container,
  Drawer,
  Group,
  Text,
  Title,
} from "@mantine/core";
import Search from "../search/search";
import { useDisclosure } from "@mantine/hooks";
import SidebarMenu from "../navigation/sidebar-menu";
import { ICategoryInTree } from "@/interfaces/interfaces";
import MainMenu from "../navigation/main-menu";
import CartDrawer from "../cart/cart-drawer";
import CartHeaderButton from "../cart/cart-header-button";
import HeaderUserButton from "./header-user-button";
import Link from "next/link";
import { IconTagStarred } from "@tabler/icons-react";

type Props = {
  categories: ICategoryInTree[];
};

const Header = ({ categories }: Props) => {
  const [sidebarMenuOpened, { toggle: toggleSidebarMenu }] =
    useDisclosure(false);

  return (
    <>
      <Container
        component="header"
        fluid
        bg="var(--mantine-color-gray-0)"
        px={{ base: "xs", sm: "md" }}
      >
        <Container size="lg" py="sm" px="0">
          <Group justify="space-between" wrap="nowrap" align="center">
            <Group wrap="nowrap">
              <Burger
                aria-label="Toggle menu"
                hiddenFrom="sm"
                onClick={toggleSidebarMenu}
              />
              <Link href="/">
                <IconTagStarred size="2.5rem" />
              </Link>
              <Title order={2}>AnyStore</Title>
            </Group>
            <Box visibleFrom="sm" w="400">
              <Search />
            </Box>
            <Group align="baseline">
              <HeaderUserButton />
              <CartHeaderButton />
            </Group>
          </Group>
        </Container>
      </Container>
      <Container fluid bg="var(--mantine-color-gray-2)" visibleFrom="sm">
        <Container size="lg" px="0" py="xs">
          <MainMenu categories={categories} />
        </Container>
      </Container>
      <Container
        fluid
        bg="var(--mantine-color-gray-2)"
        px={{ base: "xs", sm: "md" }}
      >
        <Container size="lg" px="0" py="xs" hiddenFrom="sm">
          <Search />
        </Container>
      </Container>
      <CartDrawer />
      <Drawer
        opened={sidebarMenuOpened}
        onClose={toggleSidebarMenu}
        title="Kategorier"
      >
        <SidebarMenu
          categories={categories}
          toggleSidebarMenu={toggleSidebarMenu}
        />
      </Drawer>
    </>
  );
};

export default Header;
