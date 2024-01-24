"use server";

import {
  IAggregatedListProduct,
  IAggregatedProduct,
  ICartItem,
  IMainProduct,
} from "@/interfaces/interfaces";
import { getProduct, getProductById, getProducts } from "@/lib/product";

/**
 * Fetches products from the server.
 *
 * @param offset - The offset for pagination.
 * @param limit - The maximum number of products to fetch.
 * @param categoryId - The ID of the category to filter by.
 * @param sortOrder - The sort order for the products.
 * @param searchTerm - The search term to filter products by.
 * @returns A promise that resolves to an array of products.
 */
export const fetchProducts = async (
  offset: number = 0,
  limit: number = 2,
  categoryId?: string,
  sortOrder?: string,
  searchTerm?: string
) => {
  const products: IAggregatedListProduct[] = await getProducts(
    offset,
    limit,
    categoryId
  );
  return products || [];
};

/**
 * Fetches a product by its product ID.
 * @param productId - The ID of the product to fetch.
 * @returns A promise that resolves to the fetched product.
 */
export const fetchProductByPId = async (productId: string) => {
  const product: IMainProduct | null = await getProductById(productId);
  return product;
};

/**
 * Fetches a product by its product ID, style ID and combination ID.
 * @param productId - The ID of the product to fetch.
 * @returns A promise that resolves to the fetched product.
 */
export const fetchProduct = async (
  productId: string,
  styleId?: string | undefined,
  combinationId?: string | undefined
) => {
  const product: IAggregatedProduct = await getProduct(
    productId,
    styleId,
    combinationId
  );
  return product;
};

export const validateCartStock = async (cartItems: ICartItem[]) => {
  let invalidItems: any[] = [];
  try {
    for (let item of cartItems) {
      const product = await getProduct(
        item.product_id,
        item.style_id,
        item.combination_id
      );
      if (product) {
        if (product.stock < item.quantity) {
          const stock = product.stock < 0 ? 0 : product.stock;
          invalidItems.push({ ...item, stockDiff: item.quantity - stock });
        }
      }
    }
  } catch (error) {
    return { valid: true }; //If the check couldn't be performed we let the order through (or should we not?)
  }
  if (invalidItems.length === 0) {
    return { valid: true };
  }
  return { valid: false, invalidItems };
};
