"use client";

import { useState } from "react";
import ProductListCard from "./product-list-card";
import { Box, Button, Center, Grid, GridCol, Stack, Text } from "@mantine/core";
import { fetchProducts } from "@/actions/product";
import { IAggregatedProduct } from "@/interfaces/interfaces";

type Props = {
  initialProducts: IAggregatedProduct[];
  offset: number;
  limit: number;
  total: number;
  categoryId?: string;
  sortOrder?: string;
  searchTerm?: string;
};

const ProductList = ({
  initialProducts,
  offset,
  limit,
  total,
  categoryId,
  sortOrder,
  searchTerm,
}: Props) => {
  const [products, setProducts] =
    useState<IAggregatedProduct[]>(initialProducts);
  const [productsOffset, setProductsOffset] = useState(offset);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreProducts = async () => {
    setProductsOffset(productsOffset + limit);

    setIsLoading(true);
    const products = await fetchProducts(
      productsOffset,
      limit,
      categoryId,
      sortOrder,
      searchTerm
    );

    setProducts((prev) => [...prev, ...products]);
    setIsLoading(false);
  };

  return (
    <>
      <Grid>
        {products.map((product, index) => (
          <GridCol key={index} span={{ base: 12, xs: 6, sm: 4, md: 4, lg: 3 }}>
            <ProductListCard product={product} />
          </GridCol>
        ))}
      </Grid>
      <Center>
        <Stack my="lg" gap="xs">
          <Text size="sm">
            Visar {products.length} av {total} produkter.
          </Text>
          {products.length < total && (
            <Button
              onClick={loadMoreProducts}
              variant="filled"
              loading={isLoading}
              loaderProps={{ type: "dots" }}
            >
              Ladda fler
            </Button>
          )}
        </Stack>
      </Center>
    </>
  );
};

export default ProductList;
