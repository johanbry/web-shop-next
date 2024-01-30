import LoginForm from "@/app/components/auth/login-form";
import { Container, Title, Text, Paper } from "@mantine/core";

export default async function Page() {
  return (
    <Container size="xs" px={0} my="xl">
      <Title order={1}>Admin logga in</Title>
      <Paper radius={5} shadow="xs" p="lg" mt="sm" mb="xl">
        <LoginForm isAdmin />
      </Paper>
    </Container>
  );
}
