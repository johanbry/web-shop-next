import { ICategoryInTree } from "@/interfaces/interfaces";
import { NavLink } from "@mantine/core";
import Link from "next/link";

type Props = {
  categories: ICategoryInTree[];
  rootPath?: string;
  toggleSidebarMenu?: () => void;
};

const NavLinksCategories = ({
  categories,
  rootPath = "",
  toggleSidebarMenu,
}: Props) => {
  return categories.map((category) =>
    // If category has children add a menu item with a link to the category and a link to show all products in the category.
    category.children && category.children.length > 0 ? (
      <NavLink
        component={Link}
        key={category._id}
        href={`${rootPath}/${category.slug}`}
        label={`${category.name}`}
        childrenOffset="8"
      >
        <NavLink
          onClick={() => toggleSidebarMenu && toggleSidebarMenu()}
          component={Link}
          key={`${category._id}`}
          href={`${rootPath}/${category.slug}`}
          label={`Visa ${category.name}`}
        />
        <NavLinksCategories
          categories={category.children as ICategoryInTree[]}
          rootPath={`${rootPath}/${category.slug}`}
          toggleSidebarMenu={toggleSidebarMenu}
        />
      </NavLink>
    ) : (
      <NavLink
        onClick={() => toggleSidebarMenu && toggleSidebarMenu()}
        component={Link}
        key={category._id}
        href={`${rootPath}/${category.slug}`}
        label={`${category.name}`}
      />
    )
  );
};

export default NavLinksCategories;
