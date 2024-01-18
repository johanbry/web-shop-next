"use client";

import {
  IProduct,
  IProductCombination,
  IProductStyleOption,
  IProductVariant,
  IProductVariantOption,
  IVariantSelectOption,
} from "@/interfaces/interfaces";
import { Button, Select, Text } from "@mantine/core";
import { useState } from "react";

type Props = {
  product: IProduct;
  style?: IProductStyleOption | undefined | null;
};

const ProductAddToCart = ({ product, style }: Props) => {
  const variant: IProductVariant | undefined = product.variant;

  const hasVariant =
    variant?.options && variant.options.length > 0 ? true : false; //Does the product have a variant? (like size)

  const allowOutOfStock = false; //Prepared for future feature

  const [selectedVariantValue, setSelectedVariantValue] = useState<
    string | null
  >(null);

  const [selectedCombination, setSelectedCombination] = useState<
    IProductCombination | undefined
  >();

  const [errorNotSelected, setErrorNotSelected] = useState<string | null>(null);

  const [stock, setStock] = useState<number>(() => {
    if (style) return style.stock;
    return product.stock;
  });

  const [price, setPrice] = useState<number>(() => {
    if (style) return style.price;
    return product.price;
    //TODO: If has variant, set the price to the cheapest combination and say from price?
  });

  const variantChangeHandler = (value: string | null) => {
    setSelectedVariantValue(value);
    setErrorNotSelected(null);
    if (value) {
      const selectedCombo = getCombination(value, style?.name);
      if (selectedCombo) {
        setStock(selectedCombo.stock);
        setPrice(selectedCombo.price);
        setSelectedCombination(selectedCombo);
      }
    }
  };

  const getCombination = (
    optionName: string,
    styleName: string | null = null
  ) => {
    const combination = product.combinations?.find(
      (combination: IProductCombination) => {
        if (!styleName) return combination.variant_name === optionName;
        else
          return (
            combination.variant_name === optionName &&
            combination.style_name === styleName
          );
      }
    );
    return combination;
  };

  const variantOptions = variant?.options?.reduce(
    (options: IVariantSelectOption[], option: IProductVariantOption) => {
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
        options.push(item);
      }
      return options;
    },
    []
  );

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
          placeholder={`Välj ${variant?.type}`}
          data={variantOptions}
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
