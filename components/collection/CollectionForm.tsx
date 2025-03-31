"use client"

import React from 'react'
import { Separator } from '@/components/ui/separator'
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
    tittle: z.string().min(2).max(20),
    description: z.string().min(2).max(500).trim(),
    image: z.string().min(2).max(500),
  })

const CollectionForm = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? initialData
      : {
          title: "",
          description: "",
          image: "",
        },
  });

  return (
    <div className="p-10">
        <p className="text-heading2-bold">Create Collection</p>
        <Separator className="bg-grey-1 mt-4 mb-7" />
    </div>
  )
}

export default CollectionForm