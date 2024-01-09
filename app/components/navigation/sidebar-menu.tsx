import { ICategoryInTree } from "@/interfaces/interfaces";
import { Box } from "@mantine/core";
import NavLinksCategories from "./navlinks-categories";

type Props = {
  categories: ICategoryInTree[];
  toggleSidebarMenu: () => void;
};

const SidebarMenu = ({ categories, toggleSidebarMenu }: Props) => {
  return (
    <Box>
      <NavLinksCategories
        categories={categories}
        rootPath=""
        toggleSidebarMenu={toggleSidebarMenu}
      />
      <div onClick={() => toggleSidebarMenu()}>fdsdfsdds</div>
    </Box>
  );
};

export default SidebarMenu;
