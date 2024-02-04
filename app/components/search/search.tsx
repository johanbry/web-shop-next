import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

type Props = {};

const Search = (props: Props) => {
  const router = useRouter();
  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = (event.target as HTMLFormElement)[0] as HTMLInputElement;
    const query = input.value;
    if (query && query.length > 0) {
      input.value = "";
      router.push("/sok?q=" + query);
    }
  };
  return (
    <form onSubmit={(e) => submitHandler(e)}>
      <TextInput
        variant="default"
        size="md"
        placeholder="Sök produkter"
        rightSection={<IconSearch size="20" />}
      />
    </form>
  );
};

export default Search;
