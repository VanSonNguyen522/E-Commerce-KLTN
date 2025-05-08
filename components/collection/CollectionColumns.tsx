"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpDown, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<CollectionType>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const collection = row.original;
      // Get the image or use fallback
      const imageUrl = collection.image || "/api/placeholder/80/80"; // Fallback image
      
      return (
        <div className="flex items-center justify-center py-2">
          <div className="relative h-16 w-16 rounded-md overflow-hidden border border-slate-200 shadow-sm">
            <Image
              src={imageUrl}
              alt={collection.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold text-slate-700"
        >
          Collection
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col space-y-1">
          <Link
            href={`/collections/${row.original._id}`}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-base"
          >
            {row.original.title}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "products",
    header: () => (
      <div className="flex items-center space-x-1">
        <ShoppingBag className="h-4 w-4 text-slate-600" />
        <span className="text-sm font-semibold text-slate-700">Products</span>
      </div>
    ),
    cell: ({ row }) => {
      const productCount = row.original.products.length;
      
      return (
        <Badge 
          className={`
            ${productCount > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'}
          `}
        >
          {productCount} {productCount === 1 ? 'Product' : 'Products'}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Delete item="collection" id={row.original._id} />
      </div>
    ),
  },
];