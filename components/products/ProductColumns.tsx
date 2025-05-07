"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpDown, Tag, Palette, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "media",
    header: "Image",
    cell: ({ row }) => {
      const product = row.original;
      // Get the first image from media array
      const imageUrl = product.media && product.media.length > 0 
        ? product.media[0] 
        : "/api/placeholder/80/80"; // Fallback image
      
      return (
        <div className="flex items-center justify-center py-2">
          <div className="relative h-16 w-16 rounded-md overflow-hidden border border-slate-200 shadow-sm">
            <Image
              src={imageUrl}
              alt={product.title}
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
          Product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col space-y-1">
          <Link
            href={`/products/${row.original._id}`}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 text-base"
          >
            {row.original.title}
          </Link>
          <div className="text-slate-500 text-sm line-clamp-1">
            {row.original.description?.substring(0, 50)}
            {row.original.description?.length > 50 ? "..." : ""}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => (
      <div className="flex items-center space-x-1">
        <Tag className="h-4 w-4 text-slate-600" />
        <span className="text-sm font-semibold text-slate-700">Category</span>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
          {row.original.category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "collections",
    header: "Collections",
    cell: ({ row }) => {
      const collections = row.original.collections;
      
      return (
        <div className="flex flex-wrap gap-1">
          {collections && collections.length > 0 ? (
            collections.slice(0, 2).map((collection, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              >
                {collection.title}
              </Badge>
            ))
          ) : (
            <span className="text-slate-500 text-sm italic">No collections</span>
          )}
          {collections && collections.length > 2 && (
            <Badge 
              variant="outline" 
              className="bg-slate-100 text-slate-600 border-slate-200"
            >
              +{collections.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "attributes",
    header: "Attributes",
    cell: ({ row }) => {
      const colors = row.original.colors;
      const sizes = row.original.sizes;
      
      return (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-1.5">
            <Palette className="h-3.5 w-3.5 text-slate-500" />
            <div className="flex flex-wrap gap-1">
              {colors && colors.length > 0 ? (
                colors.slice(0, 3).map((color, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-slate-50 text-slate-600 border-slate-200 text-xs py-0"
                  >
                    {color}
                  </Badge>
                ))
              ) : (
                <span className="text-slate-500 text-xs italic">No colors</span>
              )}
              {colors && colors.length > 3 && (
                <span className="text-xs text-slate-500">+{colors.length - 3}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1.5">
            <Ruler className="h-3.5 w-3.5 text-slate-500" />
            <div className="flex flex-wrap gap-1">
              {sizes && sizes.length > 0 ? (
                sizes.slice(0, 3).map((size, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-slate-50 text-slate-600 border-slate-200 text-xs py-0"
                  >
                    {size}
                  </Badge>
                ))
              ) : (
                <span className="text-slate-500 text-xs italic">No sizes</span>
              )}
              {sizes && sizes.length > 3 && (
                <span className="text-xs text-slate-500">+{sizes.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold text-slate-700"
        >
          Price (VND)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(String(row.getValue("price") || "0"));
      const expense = parseFloat(String(row.original.expense || "0"));
      const formatted = new Intl.NumberFormat("vi-VN").format(price);
      const formattedExpense = new Intl.NumberFormat("vi-VN").format(expense);
      const profit = price - expense;
      const profitFormatted = new Intl.NumberFormat("vi-VN").format(profit);
      const profitMargin = price > 0 ? (profit / price) * 100 : 0;

      return (
        <div className="flex flex-col">
          <div className="text-slate-800 font-medium">
            {formatted} VND
          </div>
          <div className="text-xs text-slate-500">
            Cost: {formattedExpense} VND
          </div>
          <div className={`text-xs font-medium ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
            Profit: {profitFormatted} VND ({profitMargin.toFixed(0)}%)
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Delete item="product" id={row.original._id} />
      </div>
    ),
  },
];