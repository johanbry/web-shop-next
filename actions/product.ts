"use server";

import { getProducts } from "@/lib/product";
import { setTimeout } from "timers/promises";

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
  await setTimeout(1000);

  const products = getProducts(offset, limit, categoryId);
  return products || [];
};
