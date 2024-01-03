import { Burger, Drawer, Group, Text } from "@mantine/core";

type Props = {};

const Header = (props: Props) => {
  return (
    <Group>
      <Burger aria-label="Toggle menu" hiddenFrom="sm" />
      <Text>Shop</Text>
      <Text>Search</Text>
      <Text>Cart</Text>

      <Text>Drawer</Text>
    </Group>
  );
};

export default Header;
