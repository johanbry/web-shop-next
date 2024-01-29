"use client";

import { Button } from "@mantine/core";
import { signOut } from "next-auth/react";

type Props = {};

const SignoutButton = (props: Props) => {
  return (
    <Button variant="filled" onClick={() => signOut()}>
      Logga ut
    </Button>
  );
};

export default SignoutButton;
