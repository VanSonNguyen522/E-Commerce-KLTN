"use client"

import { useState } from "react";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import Collection from '@/lib/models/collections';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

  interface DeleteProps {
    item: string;
    id: string;
  }
const Delete: React.FC<DeleteProps> = ({item, id}) => {

    const [loading, setLoading] = useState(false);
    const onDelete = async () => {
        try {
          setLoading(true)
          const itemType = item === "product" ? "products" : "collections"
          const res = await fetch(`/api/${itemType}/${id}`, {
            method: "DELETE",
          })
    
          if (res.ok) {
            setLoading(false)
            window.location.href = (`/${itemType}`)
            toast.success(`${item} deleted successfully`)
          }
        } catch (err) {
          console.log(err)
          toast.error("Something went wrong! Please try again.")
        }
      }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
          <Trash className="text-red-1 h-4 w-4" />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white text-grey-1">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-1">Bạn chắc chắn xóa chứ?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này sẽ không được khôi phục, bạn chắc chắn về việc xóa {item} ?.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction className="bg-red-1 text-white" onClick={onDelete}>Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Delete