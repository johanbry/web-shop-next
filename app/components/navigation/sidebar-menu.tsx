import Link from "next/link";

import { ICategoryInTree } from "@/interfaces/interfaces";
import { Box, NavLink } from "@mantine/core";

type Props = {
  categories: ICategoryInTree[];
};

const SidebarMenu = ({ categories }: Props) => {
  // Render menu by recursively rendering each level of the categories and subcategories in the tree.
  const renderMenu = (categories: ICategoryInTree[], path: string = "") => {
    return categories.map((category) =>
      // If category has children add a menu item with a link to the category and a link to show all products in the category.
      category.children && category.children.length > 0 ? (
        <NavLink
          component={Link}
          key={category._id}
          href={`${path}/${category.slug}`}
          label={`${category.name}`}
          childrenOffset="8"
        >
          <NavLink
            component={Link}
            key={`${category._id}`}
            href={`${category.slug}`}
            label={`Visa ${category.name}`}
          />
          {renderMenu(
            category.children as ICategoryInTree[],
            `${path}/${category.slug}`
          )}
        </NavLink>
      ) : (
        <NavLink
          component={Link}
          key={category._id}
          href={`${path}/${category.slug}`}
          label={`${category.name}`}
        />
      )
    );
  };

  return <Box>{renderMenu(categories)}</Box>;
};

export default SidebarMenu;
