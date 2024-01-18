import { ObjectId } from "mongoose";

export interface ICategory {
  _id: ObjectId;
  name: string;
  description?: string;
  slug: string;
  order?: number;
  parent_id?: ObjectId | null;
}

export interface ICategoryInTree {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  order?: number;
  children?: (ICategoryInTree | null)[] | null;
}

export interface IProduct {
  product_id: string;
  show: boolean;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  categories: ObjectId[];
  images?: IProductImage[];
  style?: IProductStyle;
  variant?: IProductVariant;
  combinations?: IProductCombination[];
}

export interface IAggregatedProduct {
  _id: string;
  product_id: string;
  show: boolean;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  categories: ObjectId[];
  images?: IProductImage[];
  style_options?: IProductStyle;
  style_product?: IProductStyleOption;
  variant?: IProductVariant;
  combinations?: IProductCombination[];
}

export interface IProductImage {
  filename: string;
  title?: string;
  order?: number;
}

export interface IProductStyleOption {
  style_id: string;
  name: string;
  slug?: string;
  images?: IProductImage[];
  color?: string;
  price: number;
  stock: number;
}

export interface IProductStyle {
  type: string;
  options: IProductStyleOption[];
}

export interface IProductVariant {
  type: string;
  options: IProductVariantOption[];
}

export interface IProductVariantOption {
  name: string;
}

export interface IProductCombination {
  combination_id: string;
  variant_name: string;
  style_name: string;
  stock: number;
  price: number;
  hide?: boolean;
}

export interface IVariantSelectOption {
  value: string;
  label: string;
  disabled: boolean;
}
