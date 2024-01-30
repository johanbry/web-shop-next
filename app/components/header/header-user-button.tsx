import { ActionIcon } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Props = {};

const HeaderUserButton = (props: Props) => {
  const { data: session } = useSession();

  return (
    <>
      <Link href={session ? "/minasidor" : "/loggain"}>
        <ActionIcon variant="transparent" size="lg" color="black">
          <IconUser style={{ width: "100%", height: "100%" }} />
        </ActionIcon>
      </Link>
    </>
  );
};

export default HeaderUserButton;
