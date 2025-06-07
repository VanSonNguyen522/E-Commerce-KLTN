import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Refund from "@/lib/models/refund";
import Order from "@/lib/models/order";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const refunds = await Refund.find().populate("orderId");
    return NextResponse.json(refunds, { status: 200 });
  } catch (err) {
    console.error("[refunds_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { refundId: string } }) {
  try {
    const { action } = await req.json();

    if (!action || !["approve", "reject"].includes(action)) {
      return new NextResponse("Missing or invalid action", { status: 400 });
    }

    await connectToDB();

    const refund = await Refund.findById(params.refundId);
    if (!refund) {
      return new NextResponse("Refund request not found", { status: 404 });
    }

    const order = await Order.findById(refund.orderId);
    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Handle undefined status
    if (!order.status) {
      order.status = "processing";
      await order.save();
    }

    if (action === "approve") {
      refund.status = "approved";
      order.status = "refunded";
    } else {
      refund.status = "rejected";
      order.status = "NotRefund";
    }

    await refund.save();
    await order.save();

    return NextResponse.json({ message: `Refund request ${action}d successfully`, refundId: params.refundId }, { status: 200 });
  } catch (err) {
    console.error("[refund_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";