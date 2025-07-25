type CollectionType = {
    _id: string;
    title: string;
    description: string;
    image: string;
    products: ProductType[];
  }

  type ProductType = {
    _id: string;
    title: string;
    description: string;
    media: [string];
    category: string;
    collections: [CollectionType];
    tags: [string];
    sizes: [string];
    colors: [string];
    price: number;
    expense: number;
    createdAt: Date;
    updatedAt: Date;
  }

  type OrderColumnType = {
    _id: string;
    customer: string;
    products: number;
    totalAmount: number;
    createdAt: string;
  }

  type OrderItemType = {
    product: ProductType
    color: string;
    size: string;
    quantity: number;
  }

  type CustomerType = {
    clerkId: string;
    name: string;
    email: string;
  }

  type CommentType = {
  _id: string;
  name: string;
  content: string;
  createdAt: string;
  productId: { title: string };
}

type RefundStatus = "pending" | "approved" | "rejected";

type RefundType = {
  _id: string;
  orderId: string;
  customerClerkId: string;
  reason: string;
  status: RefundStatus;
  createdAt: string;
};

type ExtendedRefundType = {
  _id: string;
  orderId: {
    _id: string;
    customerClerkId: string;
    products: ProductType[];
    totalAmount: number;
    createdAt: string;
  };
  customerClerkId: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};