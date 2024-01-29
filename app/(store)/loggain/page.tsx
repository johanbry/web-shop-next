import LoginForm from "@/app/components/auth/login-form";
import { Container, Title, Text, Paper, Center, Button } from "@mantine/core";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

type Props = {};

export default async function Page(props: Props) {
  const session = await getServerSession(authOptions);
  if (session) return redirect("/minasidor");

  return (
    <Container size="xs" px={0}>
      <Title order={1}>Logga in</Title>
      <Paper radius={5} shadow="xs" p="lg" mt="sm" mb="xl">
        <LoginForm />
        <Center mt="sm">
          <Text size="sm">
            <Link href="/skapakonto">Skapa konto</Link>
          </Text>
        </Center>
      </Paper>
    </Container>
  );
}
