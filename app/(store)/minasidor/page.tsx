import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignoutButton from "@/app/components/auth/signout-button";
import { Text, Container, Title, Button } from "@mantine/core";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Mina sidor",
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log("sessionrsc", session);

  if (!session) redirect("/loggain");
  return (
    <Container size="lg" px={0}>
      <Title>Mina sidor</Title>
      <SignoutButton />
    </Container>
  );
}
