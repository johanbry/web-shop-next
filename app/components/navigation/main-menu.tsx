import { ICategoryInTree } from "@/interfaces/interfaces";
import { Button, Menu, MenuDropdown, MenuTarget, NavLink } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";

type Props = {
  categories: ICategoryInTree[];
};

const MainMenu = ({ categories }: Props) => {
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
  return (
    <div>
      {categories.map((category) => (
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
                {renderMenu(
                  category.children as ICategoryInTree[],
                  category.slug
                )}
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
      ))}

      {/*       <Menu trigger="click-hover">
        <MenuTarget>
          <h1>Open menu</h1>
        </MenuTarget>
        <MenuDropdown style={{ width: "100%" }}>
          {renderMenu(categories)}
          <Menu.Item
            leftSection={
              <IconMessageCircle style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Messages
          </Menu.Item>
        </MenuDropdown>
      </Menu> */}
    </div>
  );
};

export default MainMenu;
