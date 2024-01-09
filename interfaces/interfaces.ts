import { ObjectId } from "mongoose";

export interface ICategory {
  _id: ObjectId;
  name: string;
  description?: string;
  slug: string;
  parent_id?: ObjectId | null;
}

export interface ICategoryInTree {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  children?: (ICategoryInTree | null)[] | null;
}
