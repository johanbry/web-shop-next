import { ICategory, ICategoryInTree } from "@/interfaces/interfaces";
import Category from "@/models/Category";
import { ObjectId } from "mongoose";
import connectToDB from "@/utils/db";

/**
 * Get all categories from database.
 *
 * @returns categories
 */

export const getAllCategories = async () => {
  let categories: ICategory[] = [];
  try {
    await connectToDB();
    categories = await Category.find({}).exec();
  } catch (error) {
    console.log((error as Error).message);
  }

  return categories;
};

/**
 * Convert flat category list with parent refs to tree.
 *
 * @param categories
 * @param parentId
 * @returns categoryList
 */

export const convertCategoriesToTree = (
  categories: ICategory[],
  parentId: ObjectId | null = null
) => {
  const categoryList: ICategoryInTree[] = [];
  let category;

  if (parentId == undefined) {
    category = categories.filter((cat) => cat.parent_id == undefined);
  } else {
    category = categories.filter(
      (cat) => cat.parent_id?.toString() == parentId.toString()
    );
  }

  for (let cat of category) {
    categoryList.push({
      _id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      children: convertCategoriesToTree(categories, cat._id),
    });
  }

  return categoryList;
};
