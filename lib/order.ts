import { IOrder } from "@/interfaces/interfaces";
import Order from "@/models/Order";

/**
 * Retrieves orders by user ID.
 * @param userId - The ID of the user.
 * @returns An array of orders.
 */
export const getOrdersByUserId = async (userId: string) => {
  let orders: IOrder[] = [];
  try {
    orders = await Order.find({ user_id: userId }).sort({ _id: -1 });
  } catch (error) {
    console.log((error as Error).message);
  }
  return JSON.parse(JSON.stringify(orders)) as IOrder[];
};
