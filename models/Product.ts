import { IMainProduct } from "@/interfaces/interfaces";
import { Schema, model, models } from "mongoose";

const ImageSchema = new Schema({
  title: {
    type: String,
  },
  order: {
    type: Number,
  },
  filename: {
    type: String,
    required: true,
  },
});

const StyleOptionSchema = new Schema({
  style_id: {
    type: String,
    required: [true, "Please add a style_id"],
    unique: [true, "Id already exists"],
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },

  images: {
    type: [ImageSchema],
    required: false,
  },
  color: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    maxlength: [5, "Price can not be more than 5 characters"],
    default: 0,
  },
  stock: {
    type: Number,
    required: [true, "Please add a stock"],
    maxlength: [5, "Stock can not be more than 5 characters"],
    default: 0,
  },
});

const StyleSchema = new Schema({
  type: {
    type: String,
    required: [true, "Please add a type"],
  },
  options: {
    type: [StyleOptionSchema],
    required: true,
  },
});

const VariantOptionSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: [true, "Name already exists"],
  },
});

const VariantSchema = new Schema({
  type: {
    type: String,
    required: [true, "Please add a type"],
  },
  options: {
    type: [VariantOptionSchema],
    required: true,
  },
});

const CombinationSchema = new Schema({
  combination_id: {
    type: String,
    required: [true, "Please add a combination_id"],
    unique: [true, "Id already exists"],
  },
  variant_name: {
    type: String,
    required: [true, "Please add a variant_name"],
  },
  style_name: {
    type: String,
    required: false,
  },
  stock: {
    type: Number,
    required: [true, "Please add a stock"],
    maxlength: [5, "Stock can not be more than 5 characters"],
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    maxlength: [5, "Price can not be more than 5 characters"],
    default: 0,
  },
  hide: {
    type: Boolean,
    default: false,
  },
});

const ProductSchema = new Schema<IMainProduct>({
  product_id: {
    type: String,
    required: true,
    unique: true,
  },
  show: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  categories: {
    type: [Schema.Types.ObjectId],
    ref: "Category",
    required: true,
  },
  images: {
    type: [ImageSchema],
    required: false,
  },
  style: {
    type: StyleSchema,
    required: false,
  },
  variant: {
    type: VariantSchema,
    required: false,
  },
  combinations: {
    type: [CombinationSchema],
    required: false,
  },
});

export default models.Product || model<IMainProduct>("Product", ProductSchema);
