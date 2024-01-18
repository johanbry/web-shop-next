import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    product_id: {
      type: String,
      required: [true, "Please add a article_id"],
      unique: [true, "Id already exists"],
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
    images: [
      {
        title: {
          type: String,
        },
        order: {
          type: Number,
        },
        filename: {
          type: String,
          required: [true, "Please add a filename"],
        },
      },
    ],
    style: {
      type: {
        type: String,
        required: [true, "Please add a type"],
        trim: true,
        maxlength: [50, "Type can not be more than 50 characters"],
      },
      options: [
        {
          style_id: {
            type: String,
            required: [true, "Please add a article_id"],
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

          images: [
            {
              title: {
                type: String,
              },
              order: {
                type: Number,
              },
              filename: {
                type: String,
                required: [true, "Please add a filename"],
              },
            },
          ],
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
        },
      ],
    },
    variant: {
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
            unique: [true, "Name already exists"],
          },
        },
      ],
    },

    combinations: [
      {
        combination_id: {
          type: String,
          required: true,
          unique: true,
        },
        variant_name: {
          type: String,
          required: true,
        },
        style_name: {
          type: String,
          required: true,
        },
        stock: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        hide: {
          type: Boolean,
        },
      },
    ],
  },

  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);
