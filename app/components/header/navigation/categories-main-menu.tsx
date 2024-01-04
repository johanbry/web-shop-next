import { ICategoryInTree } from "@/interfaces/interfaces";

type Props = {
  categories: ICategoryInTree[];
};

const CategoriesMainMenu = ({ categories }: Props) => {
  return (
    <div>
      CategoriesMainMenu
      {JSON.stringify(categories)}
      <ul>
        {categories.map((category) => (
          <li key={category._id.toString()}>
            {category.name}
            {category.children && (
              <ul>
                {category.children.map((category) => (
                  <li key={category!._id.toString()}>{category!.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesMainMenu;
