// app/api/refunds/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Refund from "@/lib/models/refund";
import Order from "@/lib/models/order";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const refunds = await Refund.find().populate({
      path: "orderId",
      model: Order,
      select: "_id customerClerkId products totalAmount createdAt",
    }).sort({ createdAt: -1 });

    return NextResponse.json(refunds, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("[refunds_GET]", err);
    
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    
    return new NextResponse("Internal error", { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}

export const dynamic = "force-dynamic";