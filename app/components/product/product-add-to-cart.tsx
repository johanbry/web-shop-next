"use client";

import { Button, Select } from "@mantine/core";
import { useState } from "react";

type Props = {
  product: any;
};

const ProductAddToCart = ({ product }: Props) => {
  const [variantValues, setVariantValues] = useState<any[] | null>([]);
  const variants: any[] = product.variants;
  const noOfVariants: number = variants.length;
  const hasVariants = variants && variants.length > 0 ? true : false;

  const variantChangeHandler = (value: string | null, index: number) => {
    alert(value + "-" + index);
    setVariantValues((prev) => {
      const newValue = [...(prev || [])];
      newValue[index] = value;
      return newValue;
    });
  };

  const variantOptions = (variant: any) => {
    return variant.options.map((variant: any, index: number) => {
      return { value: variant.name, label: variant.name };
    });
  };

  return (
    <>
      {variants.map((variant: any, index: number) => {
        return (
          <Select
            key={index}
            placeholder={`Välj ${variant.type}`}
            data={variantOptions(variant)}
            value={variantValues![index]}
            onChange={(value) => variantChangeHandler(value, index)}
          />
        );
      })}
      {variantValues}
      <Button size="xl" fullWidth>
        Lägg till i varukorg
      </Button>
    </>
  );
};

export default ProductAddToCart;
