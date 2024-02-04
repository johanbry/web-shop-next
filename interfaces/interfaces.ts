import { ObjectId } from "mongoose";
import { z } from "zod";

/**
 * Represents a product category as in the database.
 */
export interface ICategory {
  _id: ObjectId;
  name: string;
  description?: string;
  slug: string;
  order?: number;
  parent_id?: ObjectId | null;
}

/**
 * Represents a category in a tree structure.
 */
export interface ICategoryInTree {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  order?: number;
  children?: (ICategoryInTree | null)[] | null;
}

/**
 * Represents the base product interface extended by other product interfaces.
 */
interface IBaseProduct {
  product_id: string;
  show: boolean;
  name: string;
  slug: string;
  description?: string;
  price: number;
  weight?: number;
  stock: number;
  categories: ObjectId[];
  images?: IProductImage[];
  variant?: IProductVariant;
}

/**
 * Represents the main product, the product entity in the database.
 */
export interface IMainProduct extends IBaseProduct {
  style?: IProductStyle;
  combinations?: IProductCombination[];
}

/**
 * Represents an aggregated product, used to list main products, and main products with style options, as separate products.
 */
export interface IAggregatedListProduct extends IBaseProduct {
  _id: string;
  style_options?: IProductStyle;
  style_product?: IProductStyleOption;
}

/**
 * Represents an aggregated product, a specific product item specified by product, and if applicable selected style or/and combination.
 */
export interface IAggregatedProduct extends IBaseProduct {
  _id: string;
  product_type: IProductType;
  style_options?: IProductStyle;
  style_product?: IProductStyleOption;
  combination_product?: IProductCombination;
}

export interface IProductListData {
  products: IAggregatedListProduct[];
  metadata: IProductListMetadata;
}

export interface IProductListMetadata {
  total: number;
}

/**
 * Represents a product image.
 */
export interface IProductImage {
  filename: string;
  title?: string;
  order?: number;
}

/**
 * Represents the type of a product item.
 */
export type IProductType =
  | "simple"
  | "style"
  | "style-combination"
  | "combination";

/**
 * Represents a product style option.
 */
export interface IProductStyleOption {
  style_id: string;
  name: string;
  slug?: string;
  images?: IProductImage[];
  color?: string;
  price: number;
  stock: number;
}

/**
 * Represents the style of a product.
 */
export interface IProductStyle {
  type: string;
  options: IProductStyleOption[];
}

/**
 * Represents a product variant.
 */
export interface IProductVariant {
  type: string;
  options: IProductVariantOption[];
}

/**
 * Represents a product variant option.
 */
export interface IProductVariantOption {
  name: string;
}

/**
 * Represents a product combination.
 */
export interface IProductCombination {
  combination_id: string;
  variant_name: string;
  style_name?: string;
  stock: number;
  price: number;
  hide?: boolean;
}

/**
 * Represents an option for a variant select.
 */
export interface IVariantSelectOption {
  value: string;
  label: string;
  disabled: boolean;
}

/**
 * Represents the selected product IDs specifying a certain product item.
 */
export interface ISelectedProductIds {
  product_id: string;
  style_id?: string | undefined;
  combination_id?: string | undefined;
  /*   name: string;
  options?: string;
  image?: string;
  price: number; */
}

/**
 * Represents a shopping cart item.
 */
export interface ICartItem {
  product_id: string;
  style_id?: string | undefined;
  combination_id?: string | undefined;
  name: string;
  options?: string | undefined;
  image?: string | undefined;
  price: number;
  weight: number;
  quantity: number;
}

/**
 * Represents the context for managing the shopping cart.
 */
export interface ICartContext {
  cartItems: ICartItem[];
  cartOpened: boolean;
  toggleCart: () => void;
  addToCart: (
    arg0: ISelectedProductIds,
    arg1: number,
    arg2?: boolean | undefined
  ) => void;
  subtractFromCart: (arg0: ICartItem, arg1: number) => void;
  clearCart: () => void;
  qtyInCart: () => number;
  cartTotal: () => number;
  cartWeight: () => number;
}

/**
 * Represents a shipping method.
 */
export interface IShippingMethod {
  _id: ObjectId;
  name: string;
  description?: string;
  price: number;
  free_amount?: number;
  min_amount?: number;
  max_amount?: number;
  min_weight?: number;
  max_weight?: number;
}

/**
 * Represents a shipping method for an order.
 */
export interface IShippingMethodOrder {
  name: string;
  price: number;
}

/**
 * Represents a order item.
 */
export interface IOrderItem extends ICartItem {}

/**
 * Represents a order.
 */
export interface IOrder {
  order_id: string;
  createdAt: string;
  updatedAt: string;
  items: IOrderItem[];
  shipping_method: IShippingMethod;
  user_id: ObjectId | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  delivery_address?: IDeliveryAddress;
  status?: string;
  payment_reference?: string;
  payment_status?: string;
}

/**
 * Represents a delivery address.
 */
export interface IDeliveryAddress {
  name: string;
  street: string;
  street2?: string;
  zipcode: string;
  city: string;
  country: string;
}

/**
 * Represents a user in the system.
 */
export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  account?: string;
  role: IUserRole;
}

export interface ISessionUser {
  id: string;
  name: string;
  email: string;
  role: IUserRole;
}

export type IUserRole = "customer" | "admin";

/**
 * Represents a page.
 */
export interface IPage {
  _id: ObjectId;
  title: string;
  slug: string;
  content?: string;
}

/**
 * Validation schema for creating a user.
 */
export const CreateUserValidationSchema = z
  .object({
    name: z.string().min(2, { message: "Namn måste vara minst två bokstäver" }),
    email: z.string().email({ message: "Ogiltig e-postadress" }),
    password: z
      .string()
      .min(8, { message: "Lösenord måste vara minst 8 tecken" }),
    passwordConfirmation: z
      .string()
      .min(8, { message: "Lösenord måste vara minst 8 tecken" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Lösenorden matchar inte",
    path: ["passwordConfirmation"],
  });

/**
 * Represents the input for creating a user.
 */
export type CreateUserInput = z.infer<typeof CreateUserValidationSchema>;

/**
 * Validation schema for login user data.
 */
export const LoginUserValidationSchema = z.object({
  email: z.string().email({ message: "Ogiltig e-postadress" }),
  password: z
    .string()
    .min(8, { message: "Lösenord måste vara minst 8 tecken" }),
});

/**
 * Represents the input for logging in a user.
 */
export type LoginUserInput = z.infer<typeof LoginUserValidationSchema>;
