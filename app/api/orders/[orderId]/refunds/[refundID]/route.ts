// import { NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@/lib/mongoDB";
// import Refund from "@/lib/models/refund";
// import Order from "@/lib/models/order";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "http://localhost:3000, http://localhost:3001",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   "Access-Control-Allow-Credentials": "true",
// };

// export async function OPTIONS(request: NextRequest) {
//   return new Response(null, {
//     status: 200,
//     headers: corsHeaders,
//   });
// }

// export async function PUT(req: NextRequest, { params }: { params: { refundId: string } }) {
//   try {
//     const { action } = await req.json();

//     if (!action || !["approve", "reject"].includes(action)) {
//       return new NextResponse("Missing or invalid action", { status: 400, headers: corsHeaders });
//     }

//     await connectToDB();

//     const refund = await Refund.findById(params.refundId);
//     if (!refund) {
//       return new NextResponse("Refund request not found", { status: 404, headers: corsHeaders });
//     }

//     const order = await Order.findById(refund.orderId);
//     if (!order) {
//       return new NextResponse("Order not found", { status: 404, headers: corsHeaders });
//     }

//     if (action === "approve") {
//       refund.status = "approved";
//       order.status = "refunded";
//     } else {
//       refund.status = "rejected";
//       order.status = "completed"; // Updated status
//     }

//     await refund.save();
//     await order.save();

//     return NextResponse.json(
//       { message: `Refund request ${action}d successfully`, refundId: params.refundId },
//       { status: 200, headers: corsHeaders }
//     );
//   } catch (err) {
//     console.error("[refund_PUT]", err);
//     return new NextResponse("Internal error", { status: 500, headers: corsHeaders });
//   }
// }

// export const dynamic = "force-dynamic";