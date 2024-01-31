import { getAllPages } from "@/lib/page";
import {
  Box,
  Container,
  Divider,
  Flex,
  List,
  ListItem,
  NavLink,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronDownRight, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

const Footer = async () => {
  const pages = await getAllPages();
  return (
    <Container component="footer" bg="var(--mantine-color-gray-1)" fluid>
      <Container size="lg" px="0" py="md">
        <Flex direction={{ base: "column", xs: "row" }} columnGap={100}>
          <Box>
            <Title order={4}>Om shopen</Title>
            <Text size="sm">
              AnyStore är en e-handelslösning utvecklad för att passa alla,
              olika sorters företag med olika sorters produkter. Stort fokus har
              lagts på att göra hanteringen av och visningen av produkter modern
              och flexibel.
            </Text>
          </Box>
          <Box w={{ base: "100%", xs: "400" }}>
            <Title order={4}>Information</Title>
            <List icon={<IconChevronRight size={14} />}>
              {pages.map((page) => (
                <ListItem key={page._id.toString()}>
                  <Link href={`/sidor/${page.slug}`}>{page.title}</Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </Flex>
        <Divider my="xs" />
        <Text size="xs">&copy; Copyright Johan Brynielsson 2024.</Text>
      </Container>
    </Container>
  );
};

export default Footer;
