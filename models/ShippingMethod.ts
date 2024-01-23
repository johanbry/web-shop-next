import { Schema, model, models } from "mongoose";

const ShippingMethodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  free_amount: {
    type: Number,
  },
  min_amount: {
    type: Number,
  },
  max_amount: {
    type: Number,
  },
  min_weight: {
    type: Number,
  },
  max_weight: {
    type: Number,
  },
});

export default models.ShippingMethod ||
  model("ShippingMethod", ShippingMethodSchema);
