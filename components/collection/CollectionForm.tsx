"use client"

import React, { useState } from 'react'
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
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import ImageUpload from '../custom ui/ImageUpload';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Delete from '../custom ui/Delete';


const formSchema = z.object({
    title: z.string().min(2).max(20),
    description: z.string().min(2).max(500).trim(),
    image: z.string().min(2).max(500),
  })

interface CollectionFormProps {
    initialData?: CollectionType | null; //Must have "?" to make it optional
  }

const CollectionForm: React.FC<CollectionFormProps> = ({ initialData }) => {

  const router = useRouter()
  
  const [loading, setLoading] = useState(false);
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(values);
    try{

      setLoading(true);
      const url = initialData
      ? `/api/collections/${initialData._id}`
      : "/api/collections";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if(res.ok){
        setLoading(false);
        toast.success(`Collection ${initialData ? "updated" : "created"}`)
        window.location.href = "/collections";
        router.push("/collections")};
      
    } catch(err) {
      console.log("[collections_POST]", err);
      toast.error("Failed to create collection")
    }
  };

  return (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Chỉnh sửa Bộ sưu tập</p>
          <Delete id={initialData._id} item='collection' />
        </div>
      ) : (
        <p className="text-heading2-bold">Tạo bộ sưu tập</p>
      )}
        <Separator className="bg-grey-1 mt-4 mb-7" />
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên bộ sưu tập</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} onKeyDown={handleKeyPress}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miêu tả</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} rows={5} onKeyDown={handleKeyPress}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình ảnh</FormLabel>
                <FormControl>
                  <ImageUpload
                      value={field.value ? [field.value] : []}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white">
              Lưu
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/collections")}
              className="bg-blue-1 text-white"
            >
              Hủy bỏ
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CollectionForm