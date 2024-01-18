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
      description: cat.description,
      slug: cat.slug,
      children: convertCategoriesToTree(categories, cat._id),
    });
  }

  return categoryList;
};

/**
 * Get category by slug.
 *
 * @param slug
 * @returns category
 */

export const getCategoryBySlug = async (slug: string) => {
  let category: ICategory | null = null;
  try {
    await connectToDB();
    category = await Category.findOne({ slug: slug });
  } catch (error) {
    console.log((error as Error).message);
  }

  return category;
};

/**
 * Get sub categories for a category (one level down).
 *
 * @param id
 * @returns categories
 */

export const getSubCategories = async (id: ObjectId) => {
  let categories: ICategory[] = [];
  try {
    await connectToDB();
    categories = await Category.find({ parent_id: id });
  } catch (error) {
    console.log((error as Error).message);
  }

  return categories;
};

/**
 * Retrieves the parent categories of a given category ID, including the category itself.
 *
 * @param id - The ID of the category.
 * @returns An array of parent categories, starting from the immediate parent and going up the hierarchy.
 */
export const getParentCategories = async (id: ObjectId) => {
  let categories: ICategory[] = [];
  const parentCategories: ICategory[] = [];
  try {
    categories = await getAllCategories();
  } catch (error) {
    console.log((error as Error).message);
  }
  let currentCategory = categories.find(
    (cat) => cat._id.toString() === id.toString()
  );

  parentCategories.unshift(currentCategory!);

  while (currentCategory?.parent_id) {
    const nextCategory = categories.find(
      (cat) => cat._id.toString() === currentCategory?.parent_id?.toString()
    );
    if (nextCategory) {
      parentCategories.unshift(nextCategory);
    }
    currentCategory = nextCategory;
  }

  return parentCategories;
};
