"use client";

import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  Box,
  Burger,
  Group,
  Skeleton,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AppShellMain } from "@mantine/core";
import NavbarMenu from "./navbar-menu";
import Header from "./header";
import { IconSettings } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AppShellWrapper = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const { data: session } = useSession();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Link href="/admin">
              <IconSettings size="2.5rem" />
            </Link>
            <Title order={3}>FlexStore Admin</Title>
          </Group>
          <Header userInfo={session?.user?.name} />
        </Group>
      </AppShellHeader>
      <AppShellNavbar p="md" bg="var(--mantine-color-gray-0)">
        <NavbarMenu userInfo={session?.user?.name} />
      </AppShellNavbar>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
};

export default AppShellWrapper;
