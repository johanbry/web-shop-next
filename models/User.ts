import { IUser } from "@/interfaces/interfaces";
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  account: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: "customer",
  },
});

export default models.User || model<IUser>("User", UserSchema);
