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
import {
  IAggregatedProduct,
  IProductImage,
  IProductStyleOption,
} from "@/interfaces/interfaces";
import { PRODUCT_IMAGES_PATH } from "@/utils/constants";

type Props = {
  product: IAggregatedProduct;
};

const ProductListCard = ({ product }: Props) => {
  let productHref = `p/${product.product_id}`;
  let productImage: IProductImage | undefined;
  const imagesPath = PRODUCT_IMAGES_PATH;

  const isStyleProduct = product.style_product ? true : false; //Is the product a base product or a product created from a base product with style?
  let productPrice;
  let styleOptions: IProductStyleOption[] | undefined = [];
  let styleType: string | undefined = "";

  if (isStyleProduct) {
    productPrice = `${product.style_product?.price} kr`;
    productImage =
      (product.style_product?.images && product.style_product?.images[0]) ||
      (product.images && product.images[0]); //If the style product has no images, use the base product image
    styleOptions = product.style_options?.options;
    styleType = product.style_options?.type;
    productHref = `/${productHref}/${product.style_product?.style_id}/${product.style_product?.slug}`;
  } else {
    productPrice = `${product.price} kr`;
    productImage = product.images && product.images[0];
    productHref = `/${productHref}/${product.slug}`;
  }

  //Check if all style options have a color value
  const hasColors = (styleOptions: IProductStyleOption[]) => {
    return styleOptions.every(
      (option) =>
        option.color && option.color !== undefined && option.color.length > 3
    );
  };

  //Render color swatches for all for the base style options
  const colorSwatches = (styleOptions: IProductStyleOption[]) => {
    return (
      <Group gap="5">
        {styleOptions.map((option, index) => (
          <ColorSwatch color={option.color ?? ""} key={index} size={14} />
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
      style={{ borderColor: "var(--mantine-color-gray-1)" }}
    >
      <AspectRatio ratio={1 / 1}>
        {productImage ? (
          <Image
            style={{ objectFit: "contain" }}
            component={NextImage}
            fill
            src={`${imagesPath}/${productImage.filename}`}
            alt={productImage.title || product.name}
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
              {product.style_product?.name}
            </Text>
          )}
        </Box>

        {isStyleProduct &&
          (styleOptions && hasColors(styleOptions) ? (
            colorSwatches(styleOptions)
          ) : (
            <Text size="xs">Finns i {styleOptions?.length} utföranden</Text>
          ))}

        <Text style={{ fontWeight: "bolder" }}>{productPrice}</Text>
      </Stack>
    </Card>
  );
};

export default ProductListCard;
