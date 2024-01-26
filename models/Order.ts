import { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product_id: { type: String, required: true },
    style_id: { type: String },
    combination_id: { type: String },
    name: { type: String, required: true },
    options: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    image: { type: String },
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    name: { type: String, required: true },
    street: { type: String, required: true },
    street2: { type: String },
    zipcode: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    order_id: {
      type: String,
      required: true,
      unique: true,
      default: () => {
        return Math.floor(Math.random() * 1000000).toString();
      },
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    customer_email: {
      type: String,
      required: function (this: { status: string }) {
        // Only require delivery_address if status is not 'draft'
        return this.status !== "draft";
      },
    },
    customer_phone: {
      type: String,
      required: function (this: { status: string }) {
        // Only require delivery_address if status is not 'draft'
        return this.status !== "draft";
      },
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    delivery_address: {
      type: AddressSchema,
      required: function (this: { status: string }) {
        // Only require delivery_address if status is not 'draft'
        return this.status !== "draft";
      },
    },
    shipping_method: {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
    },
    payment_status: {
      type: String,
    },
    payment_reference: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Order || model("Order", OrderSchema);
