// app/api/refunds/[refundId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Refund from "@/lib/models/refund";
import Order from "@/lib/models/order";

// Simplified CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { refundId: string } }
) {
//   console.log("=== REFUND PUT REQUEST START ===");
//   console.log("URL:", req.url);
//   console.log("RefundId from params:", params.refundId);
//   console.log("Timestamp:", new Date().toISOString());

  try {
    // Parse request body
    const body = await req.json();
    const { action } = body;
    // console.log("Request body:", body);
    // console.log("Action received:", action);
    // console.log("Action type:", typeof action);

    // Validate action
    if (!action) {
    //   console.log("ERROR: Action is missing");
      return NextResponse.json(
        { success: false, message: "Action is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!["approve", "reject"].includes(action)) {
    //   console.log("ERROR: Invalid action value:", action);
      return NextResponse.json(
        { success: false, message: `Invalid action: ${action}. Must be 'approve' or 'reject'` },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate refundId format
    if (!params.refundId) {
    //   console.log("ERROR: RefundId is missing");
      return NextResponse.json(
        { success: false, message: "Refund ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!/^[0-9a-fA-F]{24}$/.test(params.refundId)) {
    //   console.log("ERROR: Invalid refundId format:", params.refundId);
      return NextResponse.json(
        { success: false, message: "Invalid refund ID format" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Connect to database
    // console.log("Connecting to database...");
    await connectToDB();
    // console.log("✅ Connected to database successfully");

    // Find refund
    // console.log("Finding refund with ID:", params.refundId);
    const refund = await Refund.findById(params.refundId);
    // console.log("Refund found:", refund ? "✅ Yes" : "❌ No");
    
    if (!refund) {
    //   console.log("ERROR: Refund not found in database");
      return NextResponse.json(
        { success: false, message: "Refund not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // console.log("Current refund status:", refund.status);
    // console.log("Refund orderId:", refund.orderId);

    // Find associated order
    // console.log("Finding order with ID:", refund.orderId);
    const order = await Order.findById(refund.orderId);
    // console.log("Order found:", order ? "✅ Yes" : "❌ No");
    
    if (!order) {
    //   console.log("ERROR: Order not found in database");
      return NextResponse.json(
        { success: false, message: "Associated order not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // console.log("Current order status:", order.status);

    // // Store old values for logging
    // const oldRefundStatus = refund.status;
    // const oldOrderStatus = order.status;

    // Update statuses
    console.log(`Processing action: ${action}`);
    if (action === "approve") {
    //   console.log("Setting refund status to 'approved' and order status to 'refunded'");
      refund.status = "approved";
      order.status = "refunded";
    } else if (action === "reject") {
    //   console.log("Setting refund status to 'rejected' and order status to 'completed'");
      refund.status = "rejected";
      order.status = "NotRefund";
    }

    // console.log(`Status changes:`);
    // console.log(`  Refund: ${oldRefundStatus} → ${refund.status}`);
    // console.log(`  Order: ${oldOrderStatus} → ${order.status}`);

    // Save changes
    // console.log("Saving refund...");
    const savedRefund = await refund.save();
    // console.log("✅ Refund saved successfully");
    
    // console.log("Saving order...");
    const savedOrder = await order.save();
    // console.log("✅ Order saved successfully");

    const response = {
      success: true,
      message: `Refund ${action}d successfully`,
      refundId: params.refundId,
      action: action,
      newRefundStatus: savedRefund.status,
      newOrderStatus: savedOrder.status,
      timestamp: new Date().toISOString()
    };

    // console.log("=== SUCCESS RESPONSE ===", response);
    // console.log("=== REFUND PUT REQUEST END ===");

    return NextResponse.json(response, { 
      status: 200, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error("=== ERROR IN PUT REQUEST ===");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Full error:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace");
    
    const errorResponse = {
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? {
        type: error?.constructor?.name,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      } : "Internal error",
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(errorResponse, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}

export const dynamic = "force-dynamic";