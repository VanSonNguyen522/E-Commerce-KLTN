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
    // item: string;
    id: string;
  }
const Delete: React.FC<DeleteProps> = ({id}) => {

    const [loading, setLoading] = useState(false);
    const onDelete = async () => {
        try {
          setLoading(true)
        //   const itemType = item === "product" ? "products" : "collections"
          const res = await fetch(`/api/collections/${id}`, {
            method: "DELETE",
          })
    
          if (res.ok) {
            setLoading(false)
            window.location.href = ("/collections")
            toast.success("Clollection deleted successfully!")
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
          <AlertDialogTitle className="text-red-1">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your Collection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-1 text-white" onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Delete