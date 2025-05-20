/// <reference types="jest" />

// --- Mocks Next.js server response ---
jest.mock('next/server', () => {
  class MockNextResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static json(body: any, init?: ResponseInit) {
      return { body, status: init?.status, headers: init?.headers, type: 'NextResponse' };
    }
    constructor(body?: BodyInit | null, init?: ResponseInit) {
      return { body, status: init?.status, headers: init?.headers, type: 'NextResponse' };
    }
  }

  return {
    NextResponse: MockNextResponse,
    NextRequest: jest.fn().mockImplementation(() => ({})),
  };
});

// --- Mocks ---
import { NextResponse, type NextRequest } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/products";
import type { Mock } from 'jest-mock';
import * as ProductDetailAPI from "../api/products/[productId]/route";

jest.mock("@/lib/mongoDB", () => ({ connectToDB: jest.fn() }));
jest.mock("@/lib/models/products", () => ({
  findById: jest.fn().mockImplementation((id: string) => ({
    populate: jest.fn().mockImplementation(() => {
      const mockData = {
        "67f14ec327a773320e0ee45e": {
          _id: "67f14ec327a773320e0ee45e",
          title: "Ván ép 16 li",
          price: 175000,
          collections: [],
        },
        "67f9dd3769d8b053f917bef1": {
          _id: "67f9dd3769d8b053f917bef1",
          title: "Ván ép 8 li",
          price: 125000,
          collections: [],
        },
      };
      return Promise.resolve(mockData[id as keyof typeof mockData] ?? null);
    })
  })),
}));

// --- Helper ---
const createMockRequest = (url: string): NextRequest =>
  ({
    nextUrl: new URL(url),
    method: "GET",
    headers: new Headers(),
    cookies: {
      get: jest.fn(),
      getAll: jest.fn(),
      has: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      toString: jest.fn(),
    },
    url,
    json: jest.fn(),
    text: jest.fn(),
  } as unknown as NextRequest);

// --- Test ---
describe("GET /api/products/[productId]", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (ProductDetailAPI.GET as jest.Mock) = jest.fn().mockImplementation(async (req, { params }) => {
      try {
        await connectToDB();
        const { productId } = params;
        const product = await Product.findById(productId).populate('collections');

        if (!product) {
          return new NextResponse("Product not found", { status: 404 });
        }

        return NextResponse.json(product, {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3001",
          },
        });
      } catch (err) {
        console.log("[product_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
      }
    });
  });

  it("returns product 16 li for valid ID", async () => {
    const req = createMockRequest("http://localhost:3000/api/products/67f14ec327a773320e0ee45e");
    const res = await ProductDetailAPI.GET(req, {
      params: { productId: "67f14ec327a773320e0ee45e" },
    });

    expect(connectToDB).toHaveBeenCalled();
    expect(Product.findById).toHaveBeenCalledWith("67f14ec327a773320e0ee45e");

    expect(res.body).toEqual(expect.objectContaining({
      _id: "67f14ec327a773320e0ee45e",
      title: "Ván ép 16 li",
      price: 175000,
    }));
    expect(res.status).toBe(200);
  });

  it("returns product 8 li for different valid ID", async () => {
    const req = createMockRequest("http://localhost:3000/api/products/67f9dd3769d8b053f917bef1");
    const res = await ProductDetailAPI.GET(req, {
      params: { productId: "67f9dd3769d8b053f917bef1" },
    });

    expect(res.body).toEqual(expect.objectContaining({
      _id: "67f9dd3769d8b053f917bef1",
      title: "Ván ép 8 li",
      price: 125000,
    }));
  });

  it("returns 404 if product does not exist", async () => {
    const req = createMockRequest("http://localhost:3000/api/products/unknown");
    const res = await ProductDetailAPI.GET(req, { params: { productId: "unknown" } });

    expect(res.body).toBe("Product not found");
    expect(res.status).toBe(404);
  });

  it("returns 500 on database error", async () => {
    (connectToDB as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    const req = createMockRequest("http://localhost:3000/api/products/67f14ec327a773320e0ee45e");
    const res = await ProductDetailAPI.GET(req, {
      params: { productId: "67f14ec327a773320e0ee45e" },
    });

    expect(consoleSpy).toHaveBeenCalledWith("[product_GET]", expect.any(Error));
    expect(res.body).toBe("Internal Error");
    expect(res.status).toBe(500);

    consoleSpy.mockRestore();
  });
});
