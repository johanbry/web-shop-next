import { ICategoryInTree } from "@/interfaces/interfaces";
import { Button, Menu, MenuDropdown, MenuTarget, NavLink } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import NavLinksCategories from "./navlinks-categories";

type Props = {
  categories: ICategoryInTree[];
};

const MainMenu = ({ categories }: Props) => {
  return categories.map((category) => (
    <Menu
      key={category._id}
      trigger="hover"
      width={200}
      offset={0}
      position="bottom-start"
    >
      {category.children && category.children.length > 0 ? (
        <>
          <MenuTarget key={category._id}>
            <Button
              variant="transparent"
              href={category.slug}
              component={Link}
              rightSection={<IconChevronDown size={16} />}
            >
              {category.name}
            </Button>
          </MenuTarget>
          <MenuDropdown visibleFrom="sm">
            <NavLinksCategories
              categories={category.children as ICategoryInTree[]}
              rootPath={category.slug}
            />
          </MenuDropdown>
        </>
      ) : (
        <Button
          variant="transparent"
          component={Link}
          href={category.slug}
          key={category._id}
        >
          {category.name}
        </Button>
      )}
    </Menu>
  ));
};

export default MainMenu;
