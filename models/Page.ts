import { IPage } from "@/interfaces/interfaces";
import { Schema, model, models } from "mongoose";

const PageSchema = new Schema<IPage>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
  },
});

export default models.Page || model<IPage>("Page", PageSchema);
