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
import { getCategoryBySlug, getSubCategories } from "@/lib/category";
import Link from "next/link";
import { Fragment } from "react";
import { getProducts, totalProducts } from "@/lib/product";
import ProductList from "@/app/components/product/product-list";
import { notFound } from "next/navigation";
import { IAggregatedProduct } from "@/interfaces/interfaces";

type Props = {
  params: { slug: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categorySlug = params.slug[params.slug.length - 1]; // The slug of the current category
  const category = await getCategoryBySlug(categorySlug);

  return {
    title: category?.name,
    description: category?.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const categorySlug = params.slug[params.slug.length - 1]; // The slug of the current category
  const category = await getCategoryBySlug(categorySlug);
  const currentPath = params.slug.join("/"); // The path of the current category
  if (!category) notFound();

  const total = await totalProducts(category._id.toString());
  const productsLimit = 1;
  const productsOffset = 0;
  const subCategories = await getSubCategories(category._id);

  const breadcrumbItems = await Promise.all(
    params.slug.map(async (slug, index) => {
      const href = `/${params.slug.slice(0, index + 1).join("/")}`;
      const cat = await getCategoryBySlug(slug);
      const name = cat?.name;

      return (
        <Fragment key={index}>
          {index === 0 && (
            <Anchor size="sm" href={"/"}>
              Hem
            </Anchor>
          )}
          {cat?.name && (
            <Anchor size="sm" href={href}>
              {name}
            </Anchor>
          )}
        </Fragment>
      );
    })
  );

  const subCategoryItems = subCategories.map((cat) => (
    <Button
      size="xs"
      radius={3}
      component={Link}
      variant="outline"
      href={`/${currentPath}/${cat.slug}`}
      key={cat._id.toString()}
    >
      {cat.name}
    </Button>
  ));

  let products: IAggregatedProduct[] = [];
  products = await getProducts(
    productsOffset,
    productsLimit,
    category._id.toString()
  );

  return (
    <Container size="lg" px={0}>
      <Breadcrumbs mb={6}>{breadcrumbItems}</Breadcrumbs>
      <Title mb={8}>{category?.name}</Title>
      <Text>{category?.description}</Text>
      <Box my={10}>{subCategoryItems}</Box>
      <Box my="var(--mantine-spacing-xl)">
        {total > 0 ? (
          <ProductList
            initialProducts={products}
            offset={productsOffset + productsLimit}
            limit={productsLimit}
            total={total}
            categoryId={category._id.toString()}
          />
        ) : (
          <Text>Inga produkter att visa</Text>
        )}
      </Box>
    </Container>
  );
}
