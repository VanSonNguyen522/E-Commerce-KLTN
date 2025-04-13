"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "_id",
    header: () => (
      <div className="text-sm font-semibold text-slate-700">Order</div>
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
      <div className="text-sm font-semibold text-slate-700">Customer</div>
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
      <div className="text-sm font-semibold text-slate-700">Products</div>
    ),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="bg-indigo-50 text-indigo-700 border-indigo-200 px-2 py-1 text-xs font-medium flex items-center gap-1"
      >
        <Package className="h-3 w-3" />
        {row.original.products} item{row.original.products !== 1 ? "s" : ""}
      </Badge>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: () => (
      <div className="text-sm font-semibold text-slate-700">Total (VND)</div>
    ),
    cell: ({ row }) => (
      <span className="text-slate-800 font-medium">
        {(Number(row.original.totalAmount) || 0).toFixed(2)} VND
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="text-sm font-semibold text-slate-700">Created At</div>
    ),
    cell: ({ row }) => {
      const parseDate = (dateStr: string): Date => {
        // Remove ordinal suffixes (st, nd, rd, th)
        const cleanDateStr = dateStr.replace(/(st|nd|rd|th)/, "");
        return new Date(cleanDateStr);
      };

      const date = parseDate(row.original.createdAt);
      return (
        <span className="text-slate-600">
          {date instanceof Date && !isNaN(date.getTime())
            ? date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Invalid Date"}
        </span>
      );
    },
  },
];