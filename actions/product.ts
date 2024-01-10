"use server";

import { getProducts } from "@/lib/product";
import { setTimeout } from "timers/promises";

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
