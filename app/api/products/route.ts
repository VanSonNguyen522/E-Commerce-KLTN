// import { auth } from "@clerk/nextjs";
// import { NextRequest, NextResponse } from "next/server";

// import { connectToDB } from "@/lib/mongoDB";
// import Product from "@/lib/models/products";
// import Collection from "@/lib/models/collections";

// // Middleware để thêm header CORS
// const corsHeaders = {
//   "Access-Control-Allow-Origin": "http://localhost:3001", // Cho phép origin từ localhost:3001
//   "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Cho phép các phương thức
//   "Access-Control-Allow-Headers": "Content-Type, Authorization", // Cho phép các header
// };

// export const POST = async (req: NextRequest) => {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     await connectToDB();

//     const {
//       title,
//       description,
//       media,
//       category,
//       collections,
//       tags,
//       sizes,
//       colors,
//       price,
//       expense,
//     } = await req.json();

//     if (!title || !description || !media || !category || !price || !expense) {
//       return new NextResponse("Not enough data to create a product", {
//         status: 400,
//       });
//     }

//     const newProduct = await Product.create({
//       title,
//       description,
//       media,
//       category,
//       collections,
//       tags,
//       sizes,
//       colors,
//       price,
//       expense,
//     });

//     await newProduct.save();

//     if (collections) {
//       for (const collectionId of collections) {
//         const collection = await Collection.findById(collectionId);
//         if (collection) {
//           collection.products.push(newProduct._id);
//           await collection.save();
//         }
//       }
//     }

//     return NextResponse.json(newProduct, { status: 200 });
//   } catch (err) {
//     console.log("[products_POST]", err);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// };

// // export const GET = async (req: NextRequest) => {
// //   try {
// //     await connectToDB();

// //     const products = await Product.find()
// //       .sort({ createdAt: "desc" })
// //       .populate({ path: "collections", model: Collection });

// //     return NextResponse.json(products, { status: 200 });
// //   } catch (err) {
// //     console.log("[products_GET]", err);
// //     return new NextResponse("Internal Error", { status: 500 });
// //   }
// // };

// export const GET = async (req: NextRequest) => {
//   try {
//     await connectToDB();

//     // Lấy query parameter 'collection'
//     const collectionId = req.nextUrl.searchParams.get("collection");

//     let products;

//     if (collectionId) {
//       // Nếu có collectionId, lọc sản phẩm thuộc collection này
//       products = await Product.find({ collections: collectionId })
//         .sort({ createdAt: "desc" })
//         .populate({ path: "collections", model: Collection });
//     } else {
//       // Nếu không có collectionId, lấy tất cả sản phẩm
//       products = await Product.find()
//         .sort({ createdAt: "desc" })
//         .populate({ path: "collections", model: Collection });
//     }

//     return NextResponse.json(products, { status: 200 });
//   } catch (err) {
//     console.log("[products_GET]", err);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// };

// // Xử lý request OPTIONS (yêu cầu preflight của CORS)
// export const OPTIONS = async () => {
//   return new NextResponse(null, { status: 204, headers: corsHeaders });
// };

// export const dynamic = "force-dynamic";


import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/products";
import Collection from "@/lib/models/collections";

// Định nghĩa kiểu cho sortOption
type SortOption = {
  [key: string]: 1 | -1 | "asc" | "desc";
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const collectionId = req.nextUrl.searchParams.get("collection");
    const sort = req.nextUrl.searchParams.get("sort");

    let sortOption: SortOption = { createdAt: "desc" }; // Mặc định sắp xếp theo mới nhất

    if (sort === "price-asc") {
      sortOption = { price: "asc" };
    } else if (sort === "price-desc") {
      sortOption = { price: "desc" };
    }

    let products;
    if (collectionId) {
      products = await Product.find({ collections: collectionId })
        .sort(sortOption)
        .populate({ path: "collections", model: Collection });
    } else {
      products = await Product.find()
        .sort(sortOption)
        .populate({ path: "collections", model: Collection });
    }

    return NextResponse.json(products, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401, headers: corsHeaders });
    }

    await connectToDB();

    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
    } = await req.json();

    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Not enough data to create a product", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const newProduct = await Product.create({
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
    });

    await newProduct.save();

    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }

    return NextResponse.json(newProduct, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.log("[products_POST]", err);
    return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
  }
};

export const OPTIONS = async () => {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
};

export const dynamic = "force-dynamic";