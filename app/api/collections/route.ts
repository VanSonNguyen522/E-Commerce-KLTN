import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import Collection from "@/lib/models/collections";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// export const POST = async (req: NextRequest) => {
//   try {
//     const { userId } = auth()

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 403 })
//     }

//     await connectToDB()

//     const { title, description, image } = await req.json()

//     const existingCollection = await Collection.findOne({ title })

//     if (existingCollection) {
//       return new NextResponse("Collection already exists", { status: 400 })
//     }

//     if (!title || !image) {
//       return new NextResponse("Title and image are required", { status: 400 })
//     }

//     const newCollection = await Collection.create({
//       title,
//       description,
//       image,
//     })

//     await newCollection.save()

//     return NextResponse.json(newCollection, { status: 200 })
//   } catch (err) {
//     console.log("[collections_POST]", err)
//     return new NextResponse("Internal Server Error", { status: 500 })
//   }
// }

// export const GET = async (req: NextRequest) => {
//   try {
//     await connectToDB()

//     const collections = await Collection.find().sort({ createdAt: "desc" })

//     return NextResponse.json(collections, { status: 200 })
//   } catch (err) {
//     console.log("[collections_GET]", err)
//     return new NextResponse("Internal Server Error", { status: 500 })
//   }
// }

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403, headers: corsHeaders });
    }

    await connectToDB();

    const { title, description, image } = await req.json();

    const existingCollection = await Collection.findOne({ title });

    if (existingCollection) {
      return new NextResponse("Collection already exists", { status: 400, headers: corsHeaders });
    }

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400, headers: corsHeaders });
    }

    const newCollection = await Collection.create({
      title,
      description,
      image,
    });

    await newCollection.save();

    return NextResponse.json(newCollection, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[collections_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const collections = await Collection.find().sort({ createdAt: "desc" });

    return NextResponse.json(collections, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[collections_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};

// Xử lý request OPTIONS (preflight request)
export const OPTIONS = async () => {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
};

export const dynamic = "force-dynamic";