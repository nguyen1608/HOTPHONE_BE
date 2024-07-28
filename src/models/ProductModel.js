import { number } from "joi";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
