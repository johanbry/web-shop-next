"use client";

import { Button, Select, Text } from "@mantine/core";
import { set } from "mongoose";
import { useState } from "react";

type Props = {
  product: any;
  style?: any;
};

const ProductAddToCart = ({ product, style }: Props) => {
  const variant: any = product.variant;
  const hasVariant = variant && variant.options.length > 0 ? true : false; //Does the product have a variant? (like size)
  const isStyleProduct = style ? true : false; //Is the product a base product or a product created from a style (like color)?
  const allowOutOfStock = false; //Prepared for future feature

  const [selectedVariantValue, setSelectedVariantValue] = useState<
    string | null
  >(null);

  const [selectedCombination, setSelectedCombination] = useState<any | null>(
    null
  );

  const [errorNotSelected, setErrorNotSelected] = useState<string | null>(null);

  const [stock, setStock] = useState<number>(() => {
    if (isStyleProduct) return style.stock;
    return product.stock;
  });

  const [price, setPrice] = useState<number>(() => {
    if (isStyleProduct) return style.price;
    return product.price;
  });

  const variantChangeHandler = (value: string | null) => {
    setSelectedVariantValue(value);
    setErrorNotSelected(null);
    if (value) {
      const selectedCombo = getCombination(value, style?.name);
      setStock(selectedCombo.stock);
      setPrice(selectedCombo.price);
      setSelectedCombination(selectedCombo);
    }
  };

  const variantOptions = (variant: any, style: any) => {
    const options = variant.options.reduce((acc: any, option: any) => {
      const combination = getCombination(option.name, style?.name);

      if (combination && !combination.hide) {
        let item = { value: option.name, label: option.name, disabled: false };

        if (combination.price !== price) {
          item.label = `${option.name} (${combination.price}:-)`;
        }
        if (combination.stock < 1 && !allowOutOfStock) {
          item.disabled = true;
          item.label = `${option.name} (Ej i lager)`;
        }
        acc.push(item);
      }
      return acc;
    }, []);

    return options;
  };

  const getCombination = (
    optionName: string,
    styleName: string | null = null
  ) => {
    const combination = product.combinations.find((combination: any) => {
      if (!styleName) return combination.variant_name === optionName;
      else
        return (
          combination.variant_name === optionName &&
          combination.style_name === styleName
        );
    });
    return combination;
  };

  const addToCartButtonHandler = () => {
    if (hasVariant && !selectedVariantValue) {
      setErrorNotSelected("Välj ett alternativ");
    } else {
      const productId = product.product_id || null;
      const styleId = style?.style_id || null;
      const combinationId = selectedCombination?.combination_id || null;
      alert(`Lägg till i varukorg: ${productId} ${styleId} ${combinationId}`);
    }
  };

  return (
    <>
      <Text size="xl" my="xl" style={{ fontSize: "30px", fontWeight: "bold" }}>
        {price} kr
      </Text>
      {!(hasVariant && !selectedVariantValue) && (
        <Text size="sm">Antal i lager: {stock}</Text>
      )}

      {hasVariant && (
        <Select
          mt="sm"
          size="xl"
          placeholder={`Välj ${variant.type}`}
          data={variantOptions(variant, style)}
          value={selectedVariantValue}
          allowDeselect={false}
          onChange={(value) => variantChangeHandler(value)}
          error={errorNotSelected ? errorNotSelected : false}
        />
      )}

      <Button
        mt="lg"
        size="xl"
        fullWidth
        onClick={addToCartButtonHandler}
        disabled={stock < 1 && !hasVariant && !allowOutOfStock}
      >
        Lägg i varukorg
      </Button>
    </>
  );
};

export default ProductAddToCart;
