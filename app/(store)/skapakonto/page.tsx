import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CreateAccountForm from "@/app/components/auth/create-account-form";
import { Container, Title, Text, Paper } from "@mantine/core";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {};

export default async function Page(props: Props) {
  const session = await getServerSession(authOptions);
  if (session) return redirect("/minasidor");
  return (
    <Container size="xs" px={0}>
      <Title order={1}>Skapa konto</Title>
      <Text my="lg">
        Skapa ett konto så kommer du åt alla dina beställningar. Logga gärna in
        direkt med ditt Google-konto så behöver du inte skapa ett konto.
      </Text>
      <Paper radius={5} shadow="xs" p="lg" mt="sm" mb="xl">
        <CreateAccountForm />
      </Paper>
    </Container>
  );
}
