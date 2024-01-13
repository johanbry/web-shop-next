"use client";

import {
  ActionIcon,
  Box,
  Burger,
  Container,
  Drawer,
  Group,
  Text,
} from "@mantine/core";
import { IconShoppingCart, IconUser, IconSearch } from "@tabler/icons-react";
import Search from "../search/search";
import { useDisclosure } from "@mantine/hooks";
import SidebarMenu from "../navigation/sidebar-menu";
import { ICategoryInTree } from "@/interfaces/interfaces";
import MainMenu from "../navigation/main-menu";

type Props = {
  categories: ICategoryInTree[];
};

const Header = ({ categories }: Props) => {
  const [cartOpened, { toggle: toggleCart }] = useDisclosure(false);
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
              <Text size="lg">Logo</Text>
            </Group>
            <Box visibleFrom="sm" w="400">
              <Search />
            </Box>
            <Box>
              <ActionIcon variant="transparent" size="lg" color="black">
                <IconUser style={{ width: "100%", height: "100%" }} />
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                size="lg"
                color="black"
                onClick={toggleCart}
              >
                <IconShoppingCart style={{ width: "100%", height: "100%" }} />
              </ActionIcon>
            </Box>
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
      <Drawer
        opened={cartOpened}
        onClose={toggleCart}
        position="right"
        title="Kundvagn"
      >
        Cart
      </Drawer>
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
