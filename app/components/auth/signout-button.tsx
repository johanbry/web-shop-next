"use client";

import { Button } from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

type Props = {};

const SignoutButton = (props: Props) => {
  const { data: session } = useSession();
  //  if (!session) redirect("/loggain");
  return (
    <Button variant="filled" onClick={() => signOut()}>
      Looga ut
    </Button>
  );
};

export default SignoutButton;
