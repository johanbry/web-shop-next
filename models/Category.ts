import { ICategory } from "@/interfaces/interfaces";
import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  order: {
    type: Number,
  },
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});

export default models.Category || model<ICategory>("Category", CategorySchema);
