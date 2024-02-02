import { Box, Container, Text } from "@mantine/core";
import { Metadata } from "next";
import ProductList from "../components/product/product-list";
import { IAggregatedListProduct } from "@/interfaces/interfaces";
import { getProducts, totalProducts } from "@/lib/product";

export const metadata: Metadata = {
  title: "Web shop Start page",
  description: "",
};

export default async function Home() {
  const categoryId = "";
  //= "65953d30733cc075b27dec53";
  const productsLimit = 8;
  const productsOffset = 0;
  const initialProductsLimit = 8;

  const productsData = await getProducts(
    productsOffset,
    initialProductsLimit,
    categoryId
  );

  const products = productsData.products as IAggregatedListProduct[];
  const total = productsData.metadata.total as number;

  return (
    <Container size="lg" px="0">
      <Box my="var(--mantine-spacing-xl)">
        {total > 0 ? (
          <ProductList
            initialProducts={products}
            offset={productsOffset + initialProductsLimit}
            limit={productsLimit}
            total={total}
            categoryId={categoryId || undefined}
          />
        ) : (
          <Text>Inga produkter att visa</Text>
        )}
      </Box>
    </Container>
  );
}
