// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import Link from "next/link";

// export const columns: ColumnDef<OrderItemType>[] = [
//   {
//     accessorKey: "product",
//     header: "Product",
//     cell: ({ row }) => {
//       return (
//         <Link
//           href={`/products/${row.original.product._id}`}
//           className="hover:text-red-1"
//         >
//           {row.original.product.title}
//         </Link>
//       );
//     },
//   },
//   {
//     accessorKey: "color",
//     header: "Color",
//   },
//   {
//     accessorKey: "size",
//     header: "Size",
//   },
//   {
//     accessorKey: "quantity",
//     header: "Quantity",
//   },
// ];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      // Check if product exists
      if (!row.original.product) {
        return <span className="text-gray-500">Product unavailable</span>;
      }
      
      return (
        <Link
          href={`/products/${row.original.product._id}`}
          className="hover:text-red-1"
        >
          {row.original.product.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      return row.original.color || "-";
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      return row.original.size || "-";
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
];