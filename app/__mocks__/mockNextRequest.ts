// __mocks__/mockNextRequest.ts
import { NextRequest } from "next/server";

export function createMockNextRequest(url: string): NextRequest {
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
      toString: jest.fn(),
    },
    geo: undefined,
    ip: undefined,
    body: null,
    bodyUsed: false,
    signal: {} as AbortSignal,
    url,
    clone: jest.fn(),
    formData: jest.fn(),
    json: jest.fn(),
    text: jest.fn(),
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
  } as unknown as NextRequest;
}
