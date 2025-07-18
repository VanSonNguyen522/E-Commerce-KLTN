// import Customer from "@/lib/models/customer";
// import Order from "@/lib/models/order";
// import { connectToDB } from "@/lib/mongoDB";

// import { NextRequest, NextResponse } from "next/server";
// import { format } from "date-fns";

// export const GET = async (req: NextRequest) => {
//   try {
//     await connectToDB()

//     const orders = await Order.find().sort({ createdAt: "desc" })

//     const orderDetails = await Promise.all(orders.map(async (order) => {
//       const customer = await Customer.findOne({ clerkId: order.customerClerkId })
//       return {
//         _id: order._id,
//         customer: customer.name,
//         products: order.products.length,
//         totalAmount: order.totalAmount,
//         createdAt: format(order.createdAt, "MMM do, yyyy")
//       }
//     }))

//     return NextResponse.json(orderDetails, { status: 200 });
//   } catch (err) {
//     console.log("[orders_GET]", err)
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

// export const dynamic = "force-dynamic";


import Customer from "@/lib/models/customer";
import Order from "@/lib/models/order";
import { connectToDB } from "@/lib/mongoDB";

import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
import { vi } from "date-fns/locale"; // Import Vietnamese locale

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB()

    const orders = await Order.find().sort({ createdAt: "desc" })

    const orderDetails = await Promise.all(orders.map(async (order) => {
      const customer = await Customer.findOne({ clerkId: order.customerClerkId })
      return {
        _id: order._id,
        customer: customer.name,
        products: order.products.length,
        totalAmount: order.totalAmount,
        status: order.status, // Add status field
        createdAt: format(order.createdAt, "dd 'tháng' MM, yyyy", { locale: vi }) // Vietnamese format
      }
    }))

    return NextResponse.json(orderDetails, { status: 200 });
  } catch (err) {
    console.log("[orders_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";