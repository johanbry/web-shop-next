import CreateAccountForm from "@/app/components/auth/create-account-form";
import LoginForm from "@/app/components/auth/login-form";
import { Container, Title, Text, Paper } from "@mantine/core";

type Props = {};

export default async function Page(props: Props) {
  return (
    <Container size="xs" px={0}>
      <Title order={1}>Logga in</Title>
      <Text my="lg">Logga in.</Text>
      <Paper radius={5} shadow="xs" p="lg" mt="sm" mb="xl">
        <LoginForm />
      </Paper>
    </Container>
  );
}
