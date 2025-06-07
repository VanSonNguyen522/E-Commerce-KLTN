import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Order from "@/lib/models/order";
import Refund from "@/lib/models/refund";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    await connectToDB();

    const refund = await Refund.findOne({ orderId: params.orderId }).populate({
      path: "orderId",
      model: Order
    });

    if (!refund) {
      return new NextResponse("Refund request not found", { 
        status: 404,
        headers: corsHeaders 
      });
    }

    return NextResponse.json(
      { refund }, 
      { 
        status: 200,
        headers: corsHeaders 
      }
    );
  } catch (err) {
    console.error("[REFUND_GET]", err);
    return new NextResponse("Internal error", { 
      status: 500,
      headers: corsHeaders 
    });
  }
}

export async function POST(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const body = await req.json();
    const { reason, customerClerkId } = body;

    // Validate required fields
    if (!reason || !customerClerkId) {
      return new NextResponse("Missing required fields (reason, customerClerkId)", { 
        status: 400,
        headers: corsHeaders 
      });
    }

    await connectToDB();

    const order = await Order.findById(params.orderId);
    if (!order) {
      return new NextResponse("Order not found", { 
        status: 404,
        headers: corsHeaders 
      });
    }

    // Check if order can be refunded
    if (order.status === "refunded") {
      return new NextResponse("Order already refunded", { 
        status: 400,
        headers: corsHeaders 
      });
    }

    if (order.status === "cancel") {
      return new NextResponse("Cannot refund cancelled order", { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Check if refund request already exists
    const existingRefund = await Refund.findOne({ orderId: params.orderId });
    if (existingRefund) {
      return new NextResponse("Refund request already exists", { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Create new refund request
    const refund = new Refund({
      orderId: params.orderId,
      customerClerkId,
      reason,
      status: "pending"
    });

    await refund.save();

    // Update order status to refunding
    order.status = "refunding";
    await order.save();

    return NextResponse.json(
      { 
        message: "Refund request submitted successfully", 
        refund: {
          id: refund._id,
          orderId: refund.orderId,
          reason: refund.reason,
          status: refund.status,
          createdAt: refund.createdAt
        }
      }, 
      { 
        status: 200,
        headers: corsHeaders 
      }
    );
  } catch (err) {
    console.error("[REFUND_POST]", err);
    return new NextResponse("Internal error", { 
      status: 500,
      headers: corsHeaders 
    });
  }
}

export const dynamic = "force-dynamic";