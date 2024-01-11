import Product from "@/models/Product";
import { ObjectId } from "mongodb";
import { Document, PipelineStage, Schema } from "mongoose";

/**
 * Get products from database, depending on category, search term, sort order, offset and limit.
 *
 * @param offset
 * @param limit
 * @param categoryId
 * @param sortOrder
 * @param searchTerm
 *
 * @returns products
 * */

// TODO: Sorting and searching

export const getProducts = async (
  offset: number = 0,
  limit: number = 2,
  categoryId?: string,
  sortOrder?: string,
  searchTerm?: string
) => {
  let products: Document[] = [];
  const pipeline: PipelineStage[] = [];

  if (categoryId) {
    pipeline.push({
      $match: {
        categories: {
          $elemMatch: {
            $eq: new ObjectId(categoryId),
          },
        },
      },
    });
  }

  pipeline.push({ $addFields: { style_options: "$style" } });
  pipeline.push({
    $unwind: { path: "$style.options", preserveNullAndEmptyArrays: true },
  });
  pipeline.push({ $addFields: { style_product: "$style.options" } });
  pipeline.push({ $unset: ["style"] });
  pipeline.push({ $skip: offset });
  pipeline.push({ $limit: limit });

  try {
    products = await Product.aggregate(pipeline);
  } catch (error) {
    console.log((error as Error).message);
  }
  return products;
};

/**
 * Calculates the total number of products.
 * If a categoryId is provided, it calculates the total number of products in that category.
 * @param categoryId - The ID of the category (optional)
 * @returns The total number of products
 */
export const totalProducts = async (categoryId?: string) => {
  const pipeline: PipelineStage[] = [
    {
      $unwind: { path: "$style.options", preserveNullAndEmptyArrays: true },
    },
    { $count: "total" },
  ];
  let total = 0;

  if (categoryId) {
    pipeline.unshift({
      $match: {
        categories: {
          $elemMatch: {
            $eq: new ObjectId(categoryId),
          },
        },
      },
    });
  }
  const doc = await Product.aggregate(pipeline);
  console.log("doc", doc);
  if (doc.length > 0) total = doc[0].total;
  return total;
};
