// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
// import { Package } from "lucide-react";

// export const columns: ColumnDef<OrderColumnType>[] = [
//   {
//     accessorKey: "_id",
//     header: () => (
//       <div className="text-sm font-semibold text-slate-700">Order</div>
//     ),
//     cell: ({ row }) => {
//       return (
//         <Link
//           href={`/orders/${row.original._id}`}
//           className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
//         >
//           {row.original._id.slice(0, 8)}...
//         </Link>
//       );
//     },
//   },
//   {
//     accessorKey: "customer",
//     header: () => (
//       <div className="text-sm font-semibold text-slate-700">Customer</div>
//     ),
//     cell: ({ row }) => (
//       <span className="text-slate-800 font-medium">
//         {row.original.customer}
//       </span>
//     ),
//   },
//   {
//     accessorKey: "products",
//     header: () => (
//       <div className="text-sm font-semibold text-slate-700">Products</div>
//     ),
//     cell: ({ row }) => (
//       <Badge
//         variant="outline"
//         className="bg-indigo-50 text-indigo-700 border-indigo-200 px-2 py-1 text-xs font-medium flex items-center gap-1"
//       >
//         <Package className="h-3 w-3" />
//         {row.original.products} item{row.original.products !== 1 ? "s" : ""}
//       </Badge>
//     ),
//   },
//   {
//     accessorKey: "totalAmount",
//     header: () => (
//       <div className="text-sm font-semibold text-slate-700">Total (VND)</div>
//     ),
//     cell: ({ row }) => (
//       <span className="text-slate-800 font-medium">
//         {(Number(row.original.totalAmount) || 0).toFixed(2)} VND
//       </span>
//     ),
//   },
//   {
//     accessorKey: "createdAt",
//     header: () => (
//       <div className="text-sm font-semibold text-slate-700">Created At</div>
//     ),
//     cell: ({ row }) => {
//       const parseDate = (dateStr: string): Date => {
//         // Remove ordinal suffixes (st, nd, rd, th)
//         const cleanDateStr = dateStr.replace(/(st|nd|rd|th)/, "");
//         return new Date(cleanDateStr);
//       };

//       const date = parseDate(row.original.createdAt);
//       return (
//         <span className="text-slate-600">
//           {date instanceof Date && !isNaN(date.getTime())
//             ? date.toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "short",
//                 day: "numeric",
//               })
//             : "Invalid Date"}
//         </span>
//       );
//     },
//   },
// ];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, XCircle, RefreshCw, AlertTriangle, Ban } from "lucide-react";

// Update the interface to include status
export interface OrderColumnType {
  _id: string;
  customer: string;
  products: number;
  totalAmount: number;
  status: "processing" | "delivered" | "cancel" | "refunding" | "NotRefund" | "refunded";
  createdAt: string;
}

// Function to get status badge variant and icon
const getStatusDisplay = (status: string) => {
  switch (status) {
    case "processing":
      return {
        variant: "outline" as const,
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Clock className="h-3 w-3" />,
        text: "Đang xử lý"
      };
    case "delivered":
      return {
        variant: "outline" as const,
        className: "bg-green-50 text-green-700 border-green-200",
        icon: <CheckCircle className="h-3 w-3" />,
        text: "Đã giao"
      };
    case "cancel":
      return {
        variant: "outline" as const,
        className: "bg-red-50 text-red-700 border-red-200",
        icon: <XCircle className="h-3 w-3" />,
        text: "Đã hủy"
      };
    case "refunding":
      return {
        variant: "outline" as const,
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <RefreshCw className="h-3 w-3" />,
        text: "Đang hoàn tiền"
      };
    case "NotRefund":
      return {
        variant: "outline" as const,
        className: "bg-orange-50 text-orange-700 border-orange-200",
        icon: <AlertTriangle className="h-3 w-3" />,
        text: "Không hoàn tiền"
      };
    case "refunded":
      return {
        variant: "outline" as const,
        className: "bg-purple-50 text-purple-700 border-purple-200",
        icon: <Ban className="h-3 w-3" />,
        text: "Đã hoàn tiền"
      };
    default:
      return {
        variant: "outline" as const,
        className: "bg-gray-50 text-gray-700 border-gray-200",
        icon: <Clock className="h-3 w-3" />,
        text: "Không xác định"
      };
  }
};

export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "_id",
    header: () => (
      <div className="text-sm font-semibold text-slate-700">Đơn hàng</div>
    ),
    cell: ({ row }) => {
      return (
        <Link
          href={`/orders/${row.original._id}`}
          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
        >
          {row.original._id.slice(0, 8)}...
        </Link>
      );
    },
  },
  {
    accessorKey: "customer",
    header: () => (
      <div className="text-sm font-semibold text-slate-700">Khách hàng</div>
    ),
    cell: ({ row }) => (
      <span className="text-slate-800 font-medium">
        {row.original.customer}
      </span>
    ),
  },
  {
    accessorKey: "products",
    header: () => (
      <div className="text-sm font-semibold text-slate-700">Sản phẩm</div>
    ),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="bg-indigo-50 text-indigo-700 border-indigo-200 px-2 py-1 text-xs font-medium flex items-center gap-1"
      >
        <Package className="h-3 w-3" />
        {row.original.products} sản phẩm
      </Badge>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: () => (
      <div className="text-sm font-semibold text-slate-700">Tổng tiền (VND)</div>
    ),
    cell: ({ row }) => (
      <span className="text-slate-800 font-medium">
        {(Number(row.original.totalAmount) || 0).toLocaleString("vi-VN")} VND
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-sm font-semibold text-slate-700">Trạng thái</div>
    ),
    cell: ({ row }) => {
      const statusDisplay = getStatusDisplay(row.original.status);
      return (
        <Badge
          variant={statusDisplay.variant}
          className={`${statusDisplay.className} px-2 py-1 text-xs font-medium flex items-center gap-1 w-fit`}
        >
          {statusDisplay.icon}
          {statusDisplay.text}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="text-sm font-semibold text-slate-700">Ngày tạo</div>
    ),
    cell: ({ row }) => (
      <span className="text-slate-600">
        {row.original.createdAt}
      </span>
    ),
  },
];