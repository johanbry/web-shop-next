import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

type Props = {};

const Search = (props: Props) => {
  return (
    <TextInput
      variant="default"
      size="md"
      placeholder="Sök produkter"
      rightSection={<IconSearch size="20" />}
    />
  );
};

export default Search;
