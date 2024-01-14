import { getProductById } from "@/lib/product";
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
} from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { Metadata } from "next";
import Image from "next/image";

import { notFound, permanentRedirect } from "next/navigation";

type Props = {
  params: { slug: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId = params.slug[0]; // The product id of the product
  const product: any = await getProductById(productId);

  return {
    title: product?.name,
    description: product?.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const productId = params.slug[0]; //The product id of the product
  const product: any = await getProductById(productId);

  if (!product) notFound();

  let productName: string = product.name;
  let productDescription: string = product.description;
  let productImages: string[] = product.images;
  let productPrice: number = product.price; //Set default price to base product price

  const isStyleProduct =
    product.style && product.style.type && product.style.options.length > 0
      ? true
      : false; //Is the product a base product or a product created from a base product with style?
  let styleId: string | null = null; // The id of the product style
  let style: any = null; // The product style object

  if (isStyleProduct) {
    styleId = params.slug[1]; //The style id from the url

    //Find the style object that matches the style id from the url
    style = product.style.options.find(
      (option: any) => option.style_id === styleId
    );

    //If a style product has no matching style id in the url, redirect to the first style
    if (!style)
      permanentRedirect(
        `/p/${productId}/${product.style.options[0].style_id}/${product.style.options[0].slug}`
      );

    productImages = [...style.images, ...productImages]; //Combine the base product images with the style product images
    productPrice = style.price; //Set the style product price
  }

  const imagesPath = "/products";

  const carouselSlides = productImages.map((image, index) => (
    <CarouselSlide key={index}>
      <AspectRatio ratio={1 / 1}>
        <Image
          alt={productName}
          src={`${imagesPath}/${image}`}
          fill
          style={{ objectFit: "contain" }}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </AspectRatio>
    </CarouselSlide>
  ));

  return (
    <Container size="lg" px={0}>
      {/* <Breadcrumbs mb={6}>{breadcrumbItems}</Breadcrumbs> */}
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
                  alt={productName}
                  src={`${imagesPath}/${productImages[0]}`}
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
        <Box w={{ base: "100", sm: "400", lg: "450" }}>
          <Title order={3} style={{ textTransform: "uppercase" }}>
            {productName}
          </Title>
          <Text size="xl">{productPrice} kr</Text>
          <Text>Titel och val köpa knapp</Text>
        </Box>
      </Flex>
      <Box maw="var(--mantine-breakpoint-sm)">
        <Title order={4}>Produktbeskrivning</Title>
        <Text>{productDescription}</Text>
        <Text>ProdId?{productId}</Text>
        <Text>Styleprod?{JSON.stringify(isStyleProduct)}</Text>
        <Text>StyleId?{styleId}</Text>
        <Text mb={4}>{JSON.stringify(style)}</Text>
      </Box>
    </Container>
  );
}
