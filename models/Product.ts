import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    product_id: {
      type: String,
      required: [true, "Please add a article_id"],
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
    slug: String,
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      default: 0,
    },
    sku: {
      type: String,
    },
    stock: {
      type: Number,
      default: 0,
    },
    categories: {
      type: [Schema.Types.ObjectId],
      ref: "Category",
    },
    images: {
      type: [String],
      default: "no-image.jpg",
    },
    style: {
      type: {
        type: String,
        required: [true, "Please add a type"],
        trim: true,
        maxlength: [50, "Type can not be more than 50 characters"],
      },
      options: [
        {
          article_id: {
            type: String,
            required: [true, "Please add a article_id"],
          },
          name: {
            type: String,
            required: [true, "Please add a name"],
            maxlength: [50, "Name can not be more than 50 characters"],
          },
          product_name: {
            type: String,
            maxlength: [50, "Name can not be more than 50 characters"],
          },
          images: {
            type: [String],
          },
          thumbnail: {
            type: String,
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
          sku: {
            type: String,
          },
          stock: {
            type: Number,
            required: [true, "Please add a stock"],
            maxlength: [5, "Stock can not be more than 5 characters"],
            default: 0,
          },
        },
      ],
    },
    variants: [
      {
        type: {
          type: String,
          required: [true, "Please add a name"],
          trim: true,
          maxlength: [50, "Name can not be more than 50 characters"],
        },
        options: [
          {
            name: {
              type: String,
              required: [true, "Please add a name"],
              trim: true,
              maxlength: [50, "Name can not be more than 50 characters"],
            },

            price: {
              type: Number,
              required: [true, "Please add a price"],
              maxlength: [5, "Price can not be more than 5 characters"],
              default: 0,
            },
            sku: {
              type: String,
            },
            stock: {
              type: Number,
              required: [true, "Please add a stock"],
              maxlength: [5, "Stock can not be more than 5 characters"],
              default: 0,
            },
          },
        ],
      },
    ],
  },

  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);
