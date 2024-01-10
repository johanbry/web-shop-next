import Product from "@/models/Product";
import { ObjectId } from "mongodb";
import { PipelineStage, Schema } from "mongoose";

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
  let products = [];
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
