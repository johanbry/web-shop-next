import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignoutButton from "@/app/components/auth/signout-button";
import { Text, Container, Title, Button, Group } from "@mantine/core";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Mina sidor",
};

export default async function Page() {
  const session = (await getServerSession(authOptions)) as unknown as {
    user: { name: string; id: string };
  };
  console.log("session", session);

  const name = session?.user?.name;
  const userId = session?.user?.id;

  if (!session) redirect("/loggain");
  return (
    <Container size="lg" px={0}>
      <Group justify="space-between">
        <Title>Mina sidor</Title>
        <SignoutButton />
      </Group>
      <Text my="lg">
        Hej {name}! Här kan du se dina beställningar.{userId}
      </Text>
    </Container>
  );
}
