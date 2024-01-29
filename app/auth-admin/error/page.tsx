import { Container, Title, Text, Paper, Alert, Center } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import Link from "next/link";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Props) {
  const errorMessage = searchParams?.error;
  const errorTitle = searchParams?.errorTitle;
  return (
    <Container size="xs" px={0} my="xl">
      <Paper radius={5} shadow="xs" p="lg" mt="sm" mb="xl">
        <Alert
          variant="light"
          color="red"
          title={errorTitle || "Det uppstod ett problem"}
          icon={<IconInfoCircle />}
        >
          {errorMessage}
        </Alert>
        <Center>
          <Text my="lg">
            Gå till <Link href="/">startsidan</Link>.
          </Text>
        </Center>
      </Paper>
    </Container>
  );
}
