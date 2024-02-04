import { IShippingMethod } from "@/interfaces/interfaces";
import ShippingMethod from "@/models/ShippingMethod";
import connectToDB from "@/utils/db";

export const getShippingMethods = async () => {
  let shippingMethods: IShippingMethod[] = [];
  try {
    await connectToDB();
    shippingMethods = await ShippingMethod.find({}).exec();
  } catch (error) {
    console.log((error as Error).message);
  }

  return JSON.parse(JSON.stringify(shippingMethods));
};
