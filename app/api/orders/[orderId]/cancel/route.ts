// import { NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@/lib/mongoDB";
// import Order from "@/lib/models/order";

// export async function PUT(req: NextRequest, { params }: { params: { orderId: string } }) {
//   try {
//     const { customerClerkId } = await req.json();

//     if (!customerClerkId) {
//       return new NextResponse("Missing customerClerkId", { status: 400 });
//     }

//     await connectToDB();

//     const order = await Order.findById(params.orderId);
//     if (!order) {
//       return new NextResponse("Order not found", { status: 404 });
//     }

//     if (order.customerClerkId !== customerClerkId) {
//       return new NextResponse("Unauthorized: You do not own this order", { status: 403 });
//     }

//     // Handle undefined status
//     if (!order.status) {
//       order.status = "processing";
//       await order.save();
//     }

//     if (order.status !== "processing") {
//       return new NextResponse(`Order cannot be canceled, current status: ${order.status}`, { status: 400 });
//     }

//     order.status = "cancel";
//     await order.save();

//     return NextResponse.json({ message: "Order canceled successfully", orderId: params.orderId }, { status: 200 });
//   } catch (err) {
//     console.error("[order.cancel_PUT]", err);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

// export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Order from "@/lib/models/order";

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3001',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function PUT(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { customerClerkId } = await req.json();

    if (!customerClerkId) {
      return new NextResponse(JSON.stringify({ error: "Missing customerClerkId" }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3001',
          'Access-Control-Allow-Credentials': 'true',
        }
      });
    }

    await connectToDB();

    const order = await Order.findById(params.orderId);
    if (!order) {
      return new NextResponse(JSON.stringify({ error: "Order not found" }), { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3001',
          'Access-Control-Allow-Credentials': 'true',
        }
      });
    }

    if (order.customerClerkId !== customerClerkId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized: You do not own this order" }), { 
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3001',
          'Access-Control-Allow-Credentials': 'true',
        }
      });
    }

    // Handle undefined status
    if (!order.status) {
      order.status = "processing";
      await order.save();
    }

    if (order.status !== "processing") {
      return new NextResponse(JSON.stringify({ error: `Order cannot be canceled, current status: ${order.status}` }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3001',
          'Access-Control-Allow-Credentials': 'true',
        }
      });
    }

    order.status = "cancel";
    await order.save();

    return new NextResponse(JSON.stringify({ message: "Order canceled successfully", orderId: params.orderId }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3001',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  } catch (err) {
    console.error("[order.cancel_PUT]", err);
    return new NextResponse(JSON.stringify({ error: "Internal error" }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3001',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }
}

export const dynamic = "force-dynamic";