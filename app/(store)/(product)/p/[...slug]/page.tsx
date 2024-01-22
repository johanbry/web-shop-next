import ProductAddToCart from "@/app/components/product/product-add-to-cart";
import {
  IMainProduct,
  IProductImage,
  IProductStyleOption,
} from "@/interfaces/interfaces";
import { getParentCategories } from "@/lib/category";
import { getProductById } from "@/lib/product";
import Product from "@/models/Product";
import { PRODUCT_IMAGES_PATH } from "@/utils/constants";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import {
  Anchor,
  Box,
  Breadcrumbs,
  Title,
  Text,
  Button,
  Container,
  Flex,
  AspectRatio,
  Paper,
  Group,
  Center,
  Tooltip,
  ColorSwatch,
  Select,
} from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { notFound, permanentRedirect } from "next/navigation";
import { Fragment } from "react";

type Props = {
  params: { slug: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId = params.slug[0]; // The product id of the product
  const product: IMainProduct | null = await getProductById(productId);

  return {
    title: product?.name,
    description: product?.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const productId = params.slug[0]; //The product id of the product
  const product: IMainProduct | null = await getProductById(productId);

  if (!product) notFound();

  let productName: string = product.name;
  let productDescription: string | undefined = product.description;
  let productImages: IProductImage[] | undefined = product.images;

  const imagesPath = PRODUCT_IMAGES_PATH;

  const isStyleProduct =
    product.style && product.style.type && product.style.options.length > 0
      ? true
      : false; //Is the product a base product or a product created from a base product with style?

  let styleId: string | null = null; // The id of the product style
  let currentStyle: IProductStyleOption | null | undefined = null; // The product style object
  const styleOptions: IProductStyleOption[] | undefined =
    product.style?.options; // The style options of the product
  let styleHasColors: boolean = false; // Does the product style have colors?
  let styleHasImages: boolean = false; // Does the product style have images?

  if (isStyleProduct) {
    styleId = params.slug[1]; //The style id from the url

    //Find the style object that matches the style id from the url
    currentStyle = styleOptions?.find(
      (option: IProductStyleOption) => option.style_id === styleId
    );

    //If a style product has no matching style id in the url, redirect to the first style
    if (!currentStyle)
      permanentRedirect(
        `/p/${productId}/${product.style?.options[0].style_id}/${product.style?.options[0].slug}`
      );

    productImages = [...(currentStyle?.images || []), ...(productImages || [])]; //Combine the base product images with the style product images

    //Check if all style options have a color value
    styleHasColors =
      styleOptions !== undefined &&
      styleOptions.every(
        (option) =>
          option.color && option.color !== undefined && option.color.length > 3
      );

    //Check if all style options have an image
    styleHasImages =
      styleOptions !== undefined &&
      styleOptions.every(
        (option) => option.images && option.images[0].filename.length > 5
      );
  }

  const carouselSlides = productImages?.map((image, index) => (
    <CarouselSlide key={index}>
      <AspectRatio ratio={1 / 1}>
        <Image
          alt={image.title || productName}
          src={`${imagesPath}/${image.filename}`}
          fill
          style={{ objectFit: "contain" }}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </AspectRatio>
    </CarouselSlide>
  ));

  const parentCategories = await getParentCategories(product.categories[0]);
  const categorySlugs = parentCategories.map((cat) => cat.slug);

  const breadcrumbItems = parentCategories.map((cat, index) => {
    const href = `/${categorySlugs.slice(0, index + 1).join("/")}`;
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
  });

  return (
    <Container size="lg" px={0}>
      <Breadcrumbs mb="xs">
        {breadcrumbItems}
        <Text component="span" size="sm">
          {productName}
        </Text>
      </Breadcrumbs>
      <Flex direction={{ base: "column", sm: "row" }} gap="xl">
        <Paper
          withBorder
          style={{ flex: 1, borderColor: "var(--mantine-color-gray-1)" }}
          p="md"
        >
          {productImages && productImages.length > 0 ? (
            productImages.length > 1 ? (
              <Carousel
                slideSize="100%"
                align="start"
                slideGap="md"
                controlsOffset="xs"
                controlSize={34}
                loop
                withIndicators
                styles={{
                  control: {
                    backgroundColor: "var(--mantine-color-white)",
                    outline: "1px var(--mantine-color-gray-4) solid",
                  },
                  indicator: {
                    backgroundColor: "var(--mantine-color-dark-6)",
                    height: "10px",
                    outline: "1px var(--mantine-color-white) solid",
                  },
                }}
              >
                {carouselSlides}
              </Carousel>
            ) : (
              <AspectRatio ratio={1 / 1}>
                <Image
                  alt={productImages[0].title || productName}
                  src={`${imagesPath}/${productImages[0].filename}`}
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </AspectRatio>
            )
          ) : (
            <AspectRatio ratio={1 / 1}>
              <IconPhoto color="var(--mantine-color-gray-1)" />
            </AspectRatio>
          )}
        </Paper>
        <Box w={{ base: "100%", sm: "400", lg: "450" }}>
          <Title order={3} style={{ textTransform: "uppercase" }}>
            {productName}
          </Title>

          {isStyleProduct && (
            <>
              <Box mt="lg" mb="xs">
                <Text component="span" fw="bold">
                  {product.style?.type}:
                </Text>
                <Text component="span"> {currentStyle?.name}</Text>
              </Box>
              <Group>
                {product.style?.options.map((option: IProductStyleOption) => {
                  return (
                    <Box key={option.style_id}>
                      {styleHasImages && (
                        <>
                          <Paper
                            withBorder
                            style={
                              option.style_id === styleId
                                ? { borderColor: "var(--mantine-color-black)" }
                                : {}
                            }
                          >
                            <Tooltip label={option.name} withArrow>
                              <Link
                                href={`/p/${product.product_id}/${option.style_id}/${option.slug}`}
                              >
                                <Box w={100} p={5}>
                                  <AspectRatio ratio={1 / 1}>
                                    <Image
                                      src={`${imagesPath}/${
                                        option.images![0].filename
                                      }`}
                                      fill
                                      alt={option.name}
                                      style={{
                                        objectFit: "contain",
                                      }}
                                      sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
                                    />
                                  </AspectRatio>
                                </Box>
                              </Link>
                            </Tooltip>
                          </Paper>
                          <Center>
                            <Text size="xs">{option.name}</Text>
                          </Center>
                        </>
                      )}
                      {!styleHasImages && styleHasColors && (
                        <Tooltip label={option.name} withArrow>
                          <Link
                            href={`/p/${product.product_id}/${option.style_id}/${option.slug}`}
                          >
                            <ColorSwatch
                              color={option.color!}
                              size={30}
                              style={
                                option.style_id === styleId
                                  ? {
                                      border:
                                        "2px var(--mantine-color-gray-6) solid",
                                    }
                                  : {}
                              }
                            />
                          </Link>
                        </Tooltip>
                      )}

                      {!styleHasImages && !styleHasColors && (
                        <Link
                          href={`/p/${product.product_id}/${option.style_id}/${option.slug}`}
                        >
                          <Button
                            variant={
                              option.style_id === styleId ? "filled" : "outline"
                            }
                            color="var(--mantine-color-gray-7)"
                            style={{ textTransform: "uppercase" }}
                          >
                            {option.name}
                          </Button>
                        </Link>
                      )}
                    </Box>
                  );
                })}
              </Group>
            </>
          )}
          <Box>
            <ProductAddToCart product={product} style={currentStyle} />
          </Box>
        </Box>
      </Flex>
      <Box maw="var(--mantine-breakpoint-sm)" mt="xl">
        <Title order={4}>Produktbeskrivning</Title>
        <Text>{productDescription}</Text>
      </Box>
    </Container>
  );
}
