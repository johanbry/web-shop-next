import { Card, CardSection, Image, Title, Text } from "@mantine/core";
import Link from "next/link";

type Props = {
  product: any;
};

const ProductListCard = ({ product }: Props) => {
  let productHref = `/product/${product.slug}`;
  let productImage = "no_image.jpg";

  const isStyleProduct = product.style_product ? true : false; //Is the product a base product or a product created from a base product with style?
  let productPrice;

  if (isStyleProduct) {
    productPrice = `${product.style_product.price} kr (s)`;
    productImage = product.style_product.images[0];
  } else {
    productPrice = `${product.price} kr (b)`;
    productImage = product.images[0];
  }

  return (
    <Card withBorder component={Link} href={productHref}>
      <CardSection>
        <Image src={productImage} alt={product.name} height={160} />
      </CardSection>
      <Title order={3}>{product.name}</Title>
      <Text>{productPrice}</Text>
    </Card>
  );
};

export default ProductListCard;
