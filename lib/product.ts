import Product from "@/models/Product";
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
  categoryId?: Schema.Types.ObjectId,
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
            $eq: categoryId,
          },
        },
      },
    });
  }

  pipeline.push({ $addFields: { styleOptions: "$style" } });
  pipeline.push({
    $unwind: { path: "$style.options", preserveNullAndEmptyArrays: true },
  });
  pipeline.push({ $addFields: { styleProduct: "$style.options" } });
  pipeline.push({ $unset: ["style"] });
  pipeline.push({ $skip: offset });
  pipeline.push({ $limit: limit });

  products = await Product.aggregate(pipeline);

  return products;
};
