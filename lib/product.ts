import {
  IAggregatedListProduct,
  IAggregatedProduct,
  IMainProduct,
  IProductListData,
  IProductListMetadata,
  IProductType,
  ISelectedProductIds,
} from "@/interfaces/interfaces";
import Product from "@/models/Product";
import connectToDB from "@/utils/db";
import { ObjectId } from "mongodb";
import { Document, HydratedDocument, PipelineStage, Schema } from "mongoose";
import { revalidatePath } from "next/cache";

/**
 * Retrieves a product by its ID.
 * @param id - The ID of the product.
 * @returns A Promise that resolves to the product document, or null if not found.
 */
export const getProductById = async (id: string) => {
  let product: IMainProduct | null = null;

  try {
    await connectToDB();
    product = await Product.findOne({ product_id: id });
  } catch (error) {
    console.log((error as Error).message);
  }
  return JSON.parse(JSON.stringify(product));
};

/**
 * Retrieves a product item based on product id and if specified style and/or combination ids.
 * @param productId - The ID of the product.
 * @param styleId - Optional. The ID of the style.
 * @param combinationId - Optional. The ID of the combination.
 * @returns The aggregated product matching the provided parameters, or null if no product is found.
 */
export const getProduct = async (
  productId: string,
  styleId?: string | undefined,
  combinationId?: string | undefined
) => {
  let products: IAggregatedProduct[] = [];
  let productType: IProductType = "simple";
  const pipeline: PipelineStage[] = [];

  pipeline.push({ $match: { product_id: productId } });

  if (styleId) {
    pipeline.push({ $addFields: { style_options: "$style" } });
    pipeline.push({
      $unwind: { path: "$style.options" },
    });
    pipeline.push({ $addFields: { style_product: "$style.options" } });
    pipeline.push({ $match: { "style_product.style_id": styleId } });
    pipeline.push({ $set: { stock: "$style_product.stock" } });
    pipeline.push({ $set: { price: "$style_product.price" } });
    pipeline.push({ $unset: ["style"] });
    productType = "style";
  }

  if (combinationId) {
    pipeline.push({
      $unwind: { path: "$combinations" },
    });
    pipeline.push({ $addFields: { combination_product: "$combinations" } });
    pipeline.push({
      $match: { "combination_product.combination_id": combinationId },
    });
    pipeline.push({ $set: { stock: "$combination_product.stock" } });
    pipeline.push({ $set: { price: "$combination_product.price" } });
    pipeline.push({ $unset: ["combinations"] });
    if (productType == "style") productType = "style-combination";
    else productType = "combination";
  }

  pipeline.push({ $addFields: { product_type: productType } });

  try {
    await connectToDB();
    products = await Product.aggregate(pipeline);
  } catch (error) {
    console.log((error as Error).message);
  }

  let product: IAggregatedProduct | null = null;
  product = products[0];

  return JSON.parse(JSON.stringify(product));
};

/**
 * Retrieves a list of products based on the specified parameters.
 * @param offset The number of products to skip in the result set. Default is 0.
 * @param limit The maximum number of products to return. Default is 2.
 * @param categoryId The ID of the category to filter the products by. Optional.
 * @param sortOrder The sort order for the products. Optional.
 * @param searchTerm The search term to match against the product name and description. Optional.
 * @returns An object containing the list of products and metadata.
 */
// TODO: Sorting

export const getProducts = async (
  offset: number = 0,
  limit: number = 2,
  categoryId?: string,
  sortOrder?: string,
  searchTerm?: string
): Promise<IProductListData> => {
  let products = [];
  const pipeline: PipelineStage[] = [];

  if (searchTerm) {
    pipeline.push({
      $search: {
        text: {
          query: searchTerm,
          path: ["name", "description"],
        },
      },
    });
  }

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
  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: [{ $skip: offset }, { $limit: limit }],
    },
  });

  try {
    await connectToDB();
    products = await Product.aggregate(pipeline);
  } catch (error) {
    console.log((error as Error).message);
  }

  const response: IProductListData = {
    products: JSON.parse(
      JSON.stringify(products[0].data)
    ) as IAggregatedListProduct[],
    metadata: products[0].metadata[0] as IProductListMetadata,
  };

  return response;
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
  try {
    await connectToDB();
    const doc = await Product.aggregate(pipeline);
    if (doc.length > 0) total = doc[0].total;
  } catch (error) {
    console.log((error as Error).message);
  }

  return total;
};

/**
 * Updates the stock of a product based on the provided ids for product, style and or combination, and quantity. Revalidates the affected product page
 * @param productIds - The productIds.
 * @param quantity - The quantity to update the stock by. Provide a negative quantity to decrease the stock.
 */
export const updateStock = async (
  productIds: ISelectedProductIds,
  quantity: number
) => {
  let path: string = "";
  try {
    const product = (await Product.findOne({
      product_id: productIds.product_id,
    })) as HydratedDocument<IMainProduct>;
    path = `p/${product.product_id}`; //Path to revalidate when product stock is updated
    if (productIds.combination_id) {
      const index = product.combinations?.findIndex(
        (combination) =>
          productIds.combination_id === combination.combination_id
      );
      if (index !== undefined && product.combinations)
        product.combinations[index].stock =
          product.combinations[index].stock + quantity;
    }
    if (productIds.style_id) {
      const index = product.style?.options.findIndex(
        (option) => productIds.style_id === option.style_id
      );
      if (!productIds.combination_id && index !== undefined && product.style)
        product.style.options[index].stock =
          product.style.options[index].stock + quantity;
      if (index !== undefined)
        path = `/${path}/${product.style?.options[index].style_id}/${product.slug}-${product.style?.options[index].slug}`;
    } else {
      product.stock = product.stock + quantity;
      path = `/${path}/${product.slug}`;
    }
    await product?.save();
  } catch (error) {
    console.log((error as Error).message);
    return;
  }
  revalidatePath(path);
};
