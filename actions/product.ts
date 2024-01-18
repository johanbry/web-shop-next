"use server";

import { IAggregatedProduct } from "@/interfaces/interfaces";
import { getProducts } from "@/lib/product";

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
  const products: IAggregatedProduct[] = await getProducts(
    offset,
    limit,
    categoryId
  );
  return products || [];
};
