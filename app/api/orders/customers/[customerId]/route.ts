// import Order from "@/lib/models/order";
// import Product from "@/lib/models/products";
// import { connectToDB } from "@/lib/mongoDB";
// import { NextRequest, NextResponse } from "next/server";

// export const GET = async (
//   req: NextRequest,
//   { params }: { params: { customerId: string } }
// ) => {
//   try {
//     await connectToDB();

//     const orders = await Order.find({
//       customerClerkId: params.customerId,
//     }).populate({ path: "products.product", model: Product });

//     return NextResponse.json(orders, { status: 200 });
//   } catch (err) {
//     console.log("[customerId_GET", err);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

// export const dynamic = "force-dynamic";

// app/api/orders/customers/[customerId]/route.ts
import Order from "@/lib/models/order";
import Product from "@/lib/models/products";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

// CORS headers function
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'http://localhost:3001', // Your frontend URL
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Handle preflight OPTIONS request
export const OPTIONS = async (req: NextRequest) => {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  try {
    await connectToDB();

    const orders = await Order.find({
      customerClerkId: params.customerId,
    }).populate({ path: "products.product", model: Product });

    return NextResponse.json(orders, { 
      status: 200,
      headers: corsHeaders() // Add CORS headers to successful response
    });
  } catch (err) {
    console.log("[customerId_GET]", err);
    return new NextResponse("Internal Server Error", { 
      status: 500,
      headers: corsHeaders() // Add CORS headers to error response too
    });
  }
};

export const dynamic = "force-dynamic";