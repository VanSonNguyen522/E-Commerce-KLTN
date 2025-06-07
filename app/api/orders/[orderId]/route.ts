// import Customer from "@/lib/models/customer";
// import Order from "@/lib/models/order";
// import Product from "@/lib/models/products";
// import { connectToDB } from "@/lib/mongoDB";
// import { NextRequest, NextResponse } from "next/server";

// export const GET = async (req: NextRequest, { params }: { params: { orderId: string }}) => {
//   try {
//     await connectToDB()

//     const orderDetails = await Order.findById(params.orderId).populate({
//       path: "products.product",
//       model: Product
//     })

//     if (!orderDetails) {
//       return new NextResponse(JSON.stringify({ message: "Order Not Found" }), { status: 404 })
//     }

//     const customer = await Customer.findOne({ clerkId: orderDetails.customerClerkId})

//     return NextResponse.json({ orderDetails, customer }, { status: 200 })
//   } catch (err) {
//     console.log("[orderId_GET]", err)
//     return new NextResponse("Internal Server Error", { status: 500 })
//   }
// }

// export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Order from "@/lib/models/order";
import Customer from "@/lib/models/customer";
import Product from "@/lib/models/products";

export const GET = async (req: NextRequest, { params }: { params: { orderId: string } }) => {
  try {
    await connectToDB();

    const orderDetails = await Order.findById(params.orderId).populate({
      path: "products.product",
      model: Product,
    });

    if (!orderDetails) {
      return new NextResponse(JSON.stringify({ message: "Order Not Found" }), { status: 404 });
    }

    // Handle undefined status
    if (!orderDetails.status) {
      orderDetails.status = "processing";
      await orderDetails.save();
    }

    const customer = await Customer.findOne({ clerkId: orderDetails.customerClerkId });

    return NextResponse.json({ orderDetails, customer }, { status: 200 });
  } catch (err) {
    console.error("[orderId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export async function PUT(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { status } = await req.json();

    if (!status) {
      return new NextResponse("Missing status", { status: 400 });
    }

    if (!["processing", "delivered", "cancel", "refunding", "NotRefund", "refunded"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    await connectToDB();

    const order = await Order.findById(params.orderId);
    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Handle undefined status
    if (!order.status) {
      order.status = "processing";
      await order.save();
    }

    order.status = status;
    await order.save();

    return NextResponse.json({ message: `Order status updated to ${status}`, orderId: params.orderId }, { status: 200 });
  } catch (err) {
    console.error("[orderId_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";