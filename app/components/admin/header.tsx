"use client";

import { Group, Text } from "@mantine/core";

import { useSession } from "next-auth/react";
import SignoutButton from "../auth/signout-button";

type Props = {
  userInfo: string | undefined | null;
};

const Header = ({ userInfo }: Props) => {
  return (
    <Group visibleFrom="xs">
      <Text>Inloggad som {userInfo}</Text>
      <SignoutButton />
    </Group>
  );
};

export default Header;
