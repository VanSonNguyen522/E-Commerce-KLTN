
import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
import { connectToDB } from "@/lib/mongoDB";
import Order from "@/lib/models/order";
import Customer from "@/lib/models/customer";
import { stripe } from "@/lib/stripe";

// export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SERECT_KEY!, {
//     typescript: true,
// });

//  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SERECT_KEY!, {
//     typescript: true,
// });

export const POST = async (req: NextRequest) => {
    try {
        const rawBody = await req.text()
        const signature = req.headers.get("Stripe-Signature") as string

        const event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SERECT!
        )
        if(event.type === "checkout.session.completed") {
            const session = event.data.object
            console.log("[webhooks_POST]", session)

            const customerInfo = {
                clerkId: session?.client_reference_id,
                name: session?.customer_details?.name,
                email: session?.customer_details?.email,
            }

            const shippingAddress = {
                street: session?.customer_details?.address?.line1,
                city: session?.customer_details?.address?.city,
                state: session?.customer_details?.address?.state,
                postalCode: session?.customer_details?.address?.postal_code,
                country: session?.customer_details?.address?.country,
              }

            //   console.log("[webhook_POST] shippingAddress:", shippingAddress);

            const retrieveSession = await stripe.checkout.sessions.retrieve(
                session.id,
                {
                    expand: ["line_items.data.price.product"],
                }
            )

            const lineItems = await retrieveSession?.line_items?.data

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const orderItems = lineItems?.map((item: any) => {
                return {
                    product: item.price.product.metadata.productId,
                    color: item.price.product.metadata.color || "N/A",
                    size: item.price.product.metadata.size || "N/A",
                    quantity: item.quantity,
                }
            })
            await connectToDB()

            const newOrder = new Order({
                customerClerkId: customerInfo.clerkId,
                products: orderItems,
                customer_details: shippingAddress,
                shippingRate: session?.shipping_cost?.shipping_rate,
                totalAmount: session.amount_total ? session.amount_total : 0,
                status: "processing", // default status (refund)
            })
            // console.log("[webhook_POST] newOrder before save:", newOrder);

            await newOrder.save()

            let customer = await Customer.findOne({ clerkId: customerInfo.clerkId })

            if (customer) {
                customer.orders.push(newOrder._id)

            } else {
                customer = new Customer({
                    ...customerInfo,
                    orders: [newOrder._id],
                })
            }

            await customer.save()
        }
        return new NextResponse("Order created successfully", { status: 200 })
    } catch (err) {
        console.log("[webhook_POST]", err)
        return new NextResponse("Internal error", { status: 500 })
    }
}