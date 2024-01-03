import { ObjectId } from "mongoose";

export interface ICategory {
  _id: ObjectId;
  name: string;
  slug: string;
  parent_id: ObjectId | null;
}

export interface ICategoryInTree {
  _id: ObjectId;
  name: string;
  slug: string;
  children: (ICategoryInTree | null)[] | null;
}
