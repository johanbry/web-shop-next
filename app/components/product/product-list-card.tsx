import {
  Card,
  CardSection,
  Image,
  Title,
  Text,
  Box,
  AspectRatio,
  Stack,
  Group,
  ColorSwatch,
} from "@mantine/core";
import Link from "next/link";
import NextImage from "next/image";
import { IconPhoto } from "@tabler/icons-react";

type Props = {
  product: any;
};

const ProductListCard = ({ product }: Props) => {
  let productHref = `/product/${product.slug}`;
  let productImage = "no_image.jpg";
  const productsPath = "/products";

  const isStyleProduct = product.style_product ? true : false; //Is the product a base product or a product created from a base product with style?
  let productPrice;
  let styleOptions: any[] = [];
  let styleType: string = "";

  if (isStyleProduct) {
    productPrice = `${product.style_product.price} kr`;
    productImage = product.style_product.images[0];
    styleOptions = product.style_options.options;
    styleType = product.style_options.type;
  } else {
    productPrice = `${product.price} kr`;
    productImage = product.images[0];
  }

  //Check if all style options have a color value
  const hasColors = (styleOptions: any[]) => {
    return styleOptions.every(
      (option) =>
        option.color && option.color !== undefined && option.color.length > 3
    );
  };

  //Render color swatches for style options
  const colorSwatches = (styleOptions: any[]) => {
    return (
      <Group gap="5">
        {styleOptions.map((option, index) => (
          <ColorSwatch color={option.color} key={index} size={14} />
        ))}
      </Group>
    );
  };

  return (
    <Card
      withBorder
      component={Link}
      href={productHref}
      p={8}
      style={{ borderColor: "#efefef" }}
    >
      <AspectRatio ratio={1 / 1}>
        {productImage ? (
          <Image
            style={{ objectFit: "contain" }}
            component={NextImage}
            fill
            src={`${productsPath}/${productImage}`}
            alt={product.name}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <IconPhoto color="var(--mantine-color-gray-1)" />
        )}
      </AspectRatio>
      <Stack
        justify="space-between"
        mih={110}
        gap="sm"
        pt="var(--mantine-spacing-xs)"
      >
        <Box>
          <Title order={6} style={{ textTransform: "uppercase" }}>
            {product.name}
          </Title>
          {isStyleProduct && (
            <Text style={{ textTransform: "uppercase" }} size="xs">
              {product.style_product.name}
            </Text>
          )}
        </Box>

        {isStyleProduct &&
          (hasColors(styleOptions) ? (
            colorSwatches(styleOptions)
          ) : (
            <Text size="xs">Finns i {styleOptions.length} utföranden</Text>
          ))}

        <Text style={{ fontWeight: "bolder" }}>{productPrice}</Text>
      </Stack>
    </Card>
  );
};

export default ProductListCard;
