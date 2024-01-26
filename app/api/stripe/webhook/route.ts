import { IOrder } from "@/interfaces/interfaces";
import { updateStock } from "@/lib/product";
import Order from "@/models/Order";
import { HydratedDocument } from "mongoose";
import stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET || "";

export async function POST(request: Request) {
  const text = await request.text();
  let event: stripe.Event;
  try {
    //Verify webhook request comes from Stripe
    const signature = request.headers.get("stripe-signature") || "";
    event = stripe.webhooks.constructEvent(text, signature, endpointSecret);

    switch (event.type) {
      //Complete the order draft with info and set statuses
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;

        let order = (await Order.findOne({
          payment_reference: checkoutSessionCompleted.id,
        })) as HydratedDocument<IOrder>;

        if (order) {
          order.status = "created";
          order.payment_status = "paid";
          order.customer_email =
            checkoutSessionCompleted.customer_details?.email;
          order.customer_phone =
            checkoutSessionCompleted.customer_details?.phone;
          order.delivery_address = {
            name: checkoutSessionCompleted.customer_details?.name ?? "",
            street:
              checkoutSessionCompleted.shipping_details?.address?.line1 ?? "",
            street2:
              checkoutSessionCompleted.shipping_details?.address?.line2 ?? "",
            zipcode:
              checkoutSessionCompleted.shipping_details?.address?.postal_code ??
              "",
            city:
              checkoutSessionCompleted.shipping_details?.address?.city ?? "",
            country:
              checkoutSessionCompleted.shipping_details?.address?.country ?? "",
          };
        }

        order = await order?.save();
        break;

      //If payment session expires return stock
      case "checkout.session.expired":
        const checkoutSessionExpired = event.data.object;

        let expiredOrder = (await Order.findOne({
          payment_reference: checkoutSessionExpired.id,
        })) as HydratedDocument<IOrder>;

        expiredOrder.items.forEach(async (item) => {
          updateStock(
            {
              product_id: item.product_id,
              style_id: item.style_id,
              combination_id: item.combination_id,
            },
            Math.abs(item.quantity)
          );
        });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.log(`Webhook error: ${(error as Error).message}`);
    return new Response(`Webhook error: ${(error as Error).message}`, {
      status: 400,
    });
  }

  return new Response("Success!", {
    status: 200,
  });
}
