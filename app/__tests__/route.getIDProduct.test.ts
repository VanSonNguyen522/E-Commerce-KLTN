/// <reference types="jest" />

// Mock Next.js server components before importing them
jest.mock('next/server', () => {
  class MockNextResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static json(body: any, init?: ResponseInit) {
      return {
        body,
        status: init?.status,
        headers: init?.headers,
        type: 'NextResponse',
      };
    }
    
    constructor(body?: BodyInit | null, init?: ResponseInit) {
      return { body, status: init?.status, headers: init?.headers, type: 'NextResponse' };
    } 
  }
  
  return {
    NextResponse: MockNextResponse,
    NextRequest: jest.fn().mockImplementation((input: RequestInfo | URL) => {
      return {};
    }),
  };
});

// Now import the mocked objects and necessary types
import { NextResponse, type NextRequest } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/products";
import type { Mock } from 'jest-mock';

// Import the API handler after all mocks are set up
import * as ProductDetailAPI from "../api/products/[productId]/route";

// Mock MongoDB dependencies
jest.mock("@/lib/mongoDB", () => ({
  connectToDB: jest.fn(),
}));

jest.mock("@/lib/models/products", () => ({
  findById: jest.fn().mockImplementation((id) => ({
    populate: jest.fn().mockImplementation(() => {
      if (id === "67f14ec327a773320e0ee45e") {
        return Promise.resolve({
          _id: "67f14ec327a773320e0ee45e",
          title: "Ván ép 16 li",
          description: "Ván ép 16 ly là một loại vật liệu xây dựng phổ biến, được làm từ các lớp gỗ...",
          media: ["image1.jpg", "image2.jpg"],
          category: "Ván Ép",
          collections: ["collection1"],
          tags: ["tag1"],
          sizes: ["size1"],
          colors: ["color1"],
          price: 175000,
          expense: 0.1,
          createdAt: "2025-04-05T15:39:47.412+00:00",
          updatedAt: "2025-04-05T15:39:47.412+00:00",
          __v: 0
        });
      } else if (id === "67f9dd3769d8b053f917bef1") {
        return Promise.resolve({
          _id: "67f9dd3769d8b053f917bef1",
          title: "Ván ép 8 li",
          description: "Ván ép 8 ly là loại vật liệu gỗ công nghiệp phổ biến, được cấu tạo từ...",
          media: ["image1.jpg", "image2.jpg"],
          category: "Ván ép",
          collections: ["collection1"],
          tags: ["tag1"],
          sizes: ["size1"],
          colors: ["color1", "color2"],
          price: 125000,
          expense: 0.1,
          createdAt: "2025-04-12T03:25:43.623+00:00",
          updatedAt: "2025-04-12T03:25:43.623+00:00",
          __v: 0
        });
      } else {
        return Promise.resolve(null);
      }
    })
  })),
}));

// Helper to create a mock request object
const createMockRequest = (url: string): NextRequest => {
  return {
    nextUrl: new URL(url),
    method: "GET",
    headers: new Headers(),
    cookies: {
      get: jest.fn(),
      getAll: jest.fn(),
      has: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      toString: jest.fn()
    },
    geo: undefined,
    ip: undefined,
    body: null,
    bodyUsed: false,
    cache: undefined,
    credentials: undefined,
    destination: "",
    integrity: "",
    keepalive: false,
    mode: undefined,
    redirect: undefined,
    referrer: "",
    referrerPolicy: "",
    signal: {} as AbortSignal,
    url: url,
    clone: jest.fn(),
    formData: jest.fn(),
    json: jest.fn(),
    text: jest.fn(),
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
  } as unknown as NextRequest;
};

describe("Product Detail GET API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up the default mock implementation for the GET handler
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return product details when valid ID is provided", async () => {
    const mockRequest = createMockRequest("http://localhost:3000/api/products/67f14ec327a773320e0ee45e");
    const mockParams = { params: { productId: "67f14ec327a773320e0ee45e" } };

    const response = await ProductDetailAPI.GET(mockRequest, mockParams);

    // Verify that the connectToDB function was called
    expect(connectToDB).toHaveBeenCalled();
    
    // Verify that Product.findById was called with the correct productId
    expect(Product.findById).toHaveBeenCalledWith("67f14ec327a773320e0ee45e");
    
    // Verify the response contains the correct product data
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: "67f14ec327a773320e0ee45e",
        title: "Ván ép 16 li",
        price: 175000,
      })
    );
    // Verify the response status and headers
    expect(response.status).toBe(200);
    expect(response.headers).toEqual(
      expect.objectContaining({
        "Access-Control-Allow-Origin": "http://localhost:3001",
      })
    );
  });
  
  it("should return different product details for another valid ID", async () => {
    const mockRequest = createMockRequest("http://localhost:3000/api/products/67f9dd3769d8b053f917bef1");
    const mockParams = { params: { productId: "67f9dd3769d8b053f917bef1" } };

    const response = await ProductDetailAPI.GET(mockRequest, mockParams);

    // Verify the response contains the correct product data
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: "67f9dd3769d8b053f917bef1",
        title: "Ván ép 8 li",
        price: 125000,
      })
    );
  });

  it("should return 404 when product ID does not exist", async () => {
    const mockRequest = createMockRequest("http://localhost:3000/api/products/nonexistentid");
    const mockParams = { params: { productId: "nonexistentid" } };

    const response = await ProductDetailAPI.GET(mockRequest, mockParams);

    // Verify response is 404
    expect(response.body).toBe("Product not found");
    expect(response.status).toBe(404);
  });

  it("should handle database errors properly", async () => {
    // Mock the connectToDB function to throw an error
    (connectToDB as jest.Mock).mockRejectedValueOnce(new Error("Database connection error"));

    // Mock the console.log to prevent error output during tests
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    
    const mockRequest = createMockRequest("http://localhost:3000/api/products/67f14ec327a773320e0ee45e");
    const mockParams = { params: { productId: "67f14ec327a773320e0ee45e" } };

    const response = await ProductDetailAPI.GET(mockRequest, mockParams);

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith("[product_GET]", expect.any(Error));
    
    // Verify response is 500
    // Verify response is 500
    expect(response.body).toBe("Internal Error");
    expect(response.status).toBe(500);
    consoleSpy.mockRestore();
  });
});