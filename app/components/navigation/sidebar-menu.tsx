import Link from "next/link";

import { ICategoryInTree } from "@/interfaces/interfaces";
import { Box, NavLink } from "@mantine/core";
import NavLinksCategories from "./navlinks-categories";

type Props = {
  categories: ICategoryInTree[];
};

const SidebarMenu = ({ categories }: Props) => {
  return (
    <Box>
      <NavLinksCategories categories={categories} rootPath="" />
    </Box>
  );
};

export default SidebarMenu;
