import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { Comment } from "@/lib/models/comments";
import Product   from "@/lib/models/products";
import mongoose from "mongoose";
// import Product from '@/lib/models/products';

const corsHeaders = {
  // "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// export const GET = async (req: NextRequest) => {
//   try {
//     await connectToDB();

//     const productId = req.nextUrl.searchParams.get("productId");

//     let comments;
//     if (productId) {
//       if (!mongoose.Types.ObjectId.isValid(productId)) {
//         return new NextResponse(JSON.stringify({ error: "Invalid productId" }), {
//           status: 400,
//           headers: corsHeaders,
//         });
//       }
//       comments = await Comment.find({ productId })
//         .populate("productId", "title")
//         .sort({ createdAt: -1 });
//     } else {
//       comments = await Comment.find()
//         .populate("productId", "title")
//         .sort({ createdAt: -1 });
//     }

//     return NextResponse.json(comments, { status: 200, headers: corsHeaders });
//   } catch (err) {
//     console.log("[comments_GET]", err);
//     return new NextResponse(JSON.stringify({ error: "Failed to fetch comments" }), {
//       status: 500,
//       headers: corsHeaders,
//     });
//   }
// };

// export const GET = async (req: NextRequest) => {
//   try {
//     await connectToDB();

//     const productId = req.nextUrl.searchParams.get("productId");

//     let comments;
//     if (productId) {
//       if (!mongoose.Types.ObjectId.isValid(productId)) {
//         return new NextResponse(JSON.stringify({ error: "Invalid productId" }), {
//           status: 400,
//           headers: corsHeaders,
//         });
//       }
//       comments = await Comment.find({ productId })
//         .populate("productId", "title")
//         .sort({ createdAt: -1 });
//     } else {
//       comments = await Comment.find()
//         .populate("productId", "title")
//         .sort({ createdAt: -1 });
//     }

//     return NextResponse.json(comments, { status: 200, headers: corsHeaders });
//   } catch (err) {
//     console.log("[comments_GET]", err);
//     return new NextResponse(JSON.stringify({ error: "Failed to fetch comments" }), {
//       status: 500,
//       headers: corsHeaders,
//     });
//   }
// };

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const productId = req.nextUrl.searchParams.get("productId");

    let comments;
    if (productId) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return new NextResponse(JSON.stringify({ error: "Invalid productId" }), {
          status: 400,
          headers: corsHeaders,
        });
      }
      comments = await Comment.find({ productId }).sort({ createdAt: -1 });
    } else {
      comments = await Comment.find().sort({ createdAt: -1 });
    }

    // Manual populate để tránh lỗi schema
    const populatedComments = await Promise.all(
      comments.map(async (comment) => {
        try {
          const product = await Product.findById(comment.productId);
          return {
            ...comment.toObject(),
            productId: {
              _id: comment.productId,
              title: product?.title || "Unknown Product"
            }
          };
        } catch (err) {
          return {
            ...comment.toObject(),
            productId: {
              _id: comment.productId,
              title: "Unknown Product"
            }
          };
        }
      })
    );

    return NextResponse.json(populatedComments, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[comments_GET]", err);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch comments" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { productId, name, content, clerkId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(productId) || !name || !content) {
      return new NextResponse(JSON.stringify({ error: "Missing or invalid required fields" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    await connectToDB();

    const comment = await Comment.create({
      clerkId: clerkId || null,
      name,
      productId,
      content,
      createdAt: new Date(),
    });

    await comment.save();

    return NextResponse.json(comment, { status: 201, headers: corsHeaders });
  } catch (err) {
    console.log("[comments_POST]", err);
    return new NextResponse(JSON.stringify({ error: "Failed to create comment" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { id } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new NextResponse(JSON.stringify({ error: "Invalid comment id" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    await connectToDB();

    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return new NextResponse(JSON.stringify({ error: "Comment not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    return NextResponse.json({ message: "Comment deleted" }, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[comments_DELETE]", err);
    return new NextResponse(JSON.stringify({ error: "Failed to delete comment" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const OPTIONS = async () => {
  console.log("[comments_OPTIONS] Preflight request received");
  return new NextResponse(null, { status: 204, headers: corsHeaders });
};

export const dynamic = "force-dynamic";