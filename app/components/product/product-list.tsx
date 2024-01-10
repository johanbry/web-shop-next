"use client";

import { Fragment, useState } from "react";
import ProductListCard from "./product-list-card";
import { Button, Center, Grid, GridCol } from "@mantine/core";
import { fetchProducts } from "@/actions/product";

type Props = {
  initialProducts: any[];
  offset: number;
  limit: number;
  category?: string;
  sortOrder?: string;
  searchTerm?: string;
};

const ProductList = ({
  initialProducts,
  offset,
  limit,
  category,
  sortOrder,
  searchTerm,
}: Props) => {
  const [products, setProducts] = useState(initialProducts);
  const [productsOffset, setProductsOffset] = useState(offset);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreProducts = async () => {
    setProductsOffset(productsOffset + limit);
    setIsLoading(true);
    const products = await fetchProducts(
      productsOffset,
      limit,
      category,
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
          <GridCol key={index} span={{ base: 12, xs: 6, sm: 6, md: 3, lg: 3 }}>
            <ProductListCard product={product} />
          </GridCol>
        ))}
      </Grid>
      <Center>
        <Button
          onClick={loadMoreProducts}
          variant="outline"
          my={15}
          loading={isLoading}
          loaderProps={{ type: "dots" }}
        >
          Ladda fler
        </Button>
      </Center>
    </>
  );
};

export default ProductList;
