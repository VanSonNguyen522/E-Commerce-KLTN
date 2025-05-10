"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Mail, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<CustomerType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold text-slate-700"
        >
          <User className="mr-2 h-4 w-4 text-slate-600" />
          Customer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium text-slate-800">{row.original.name}</div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold text-slate-700"
        >
          <Mail className="mr-2 h-4 w-4 text-slate-600" />
          Email Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-slate-600">
          <a href={`mailto:${row.original.email}`} className="hover:text-indigo-600 transition-colors">
            {row.original.email}
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "clerkId",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-1">
          <Hash className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-semibold text-slate-700">Customer ID</span>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="font-mono text-xs bg-slate-50 text-slate-600 border-slate-200">
          {row.original.clerkId}
        </Badge>
      );
    },
  }
];