import {
  Anchor,
  Box,
  Breadcrumbs,
  Title,
  Text,
  Button,
  Container,
} from "@mantine/core";
import { Metadata } from "next";
import { getProducts, totalProducts } from "@/lib/product";
import ProductList from "@/app/components/product/product-list";
import { IAggregatedListProduct } from "@/interfaces/interfaces";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sökresultat",
  };
}

export default async function CategoryPage({ searchParams }: Props) {
  const searchTerm = searchParams?.q as string;

  let total = 0;

  const productsLimit = 4;
  const productsOffset = 0;
  const initialProductsLimit = Number(searchParams?.initlimit) || productsLimit;

  const productsData = await getProducts(
    productsOffset,
    initialProductsLimit,
    undefined,
    undefined,
    searchTerm
  );

  let products = productsData.products as IAggregatedListProduct[];
  if (products && products.length > 0) total = productsData.metadata.total;

  return (
    <Container size="lg" px={0}>
      <Title mb={8}>Sökresultat för &quot;{searchTerm}&quot;</Title>

      <Box my="var(--mantine-spacing-xl)">
        {total > 0 ? (
          <ProductList
            initialProducts={products}
            offset={productsOffset + initialProductsLimit}
            limit={productsLimit}
            total={total}
            categoryId={undefined}
            sortOrder={undefined}
            searchTerm={searchTerm}
          />
        ) : (
          <Text>Inga produkter matchade sökningen</Text>
        )}
      </Box>
    </Container>
  );
}
