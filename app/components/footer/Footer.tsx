import { Box, Container, Divider, Flex, Text, Title } from "@mantine/core";

type Props = {};

const Footer = (props: Props) => {
  return (
    <Container component="footer" bg="var(--mantine-color-gray-0)" fluid>
      <Container size="lg" px="0" py="md">
        <Flex>
          <Box>
            <Title order={4}>Om shopen</Title>
            <Text size="sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi ex
              commodi provident veniam. Eligendi porro at molestias soluta
              cupiditate. Cumque culpa, soluta animi necessitatibus fugit unde
              dignissimos accusantium repellat sint.
            </Text>
          </Box>
        </Flex>
        <Divider py="xs" />
        <Text size="xs">&copy; Copyright Johan Brynielsson 2024.</Text>
      </Container>
    </Container>
  );
};

export default Footer;
