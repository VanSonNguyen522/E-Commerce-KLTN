"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, RefreshCw, Grid, FolderOpen } from "lucide-react";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/collection/CollectionColumns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Collections = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionType[]>([]);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data = await res.json();
      setCollections(data);
      setLoading(false);
    } catch (err) {
      console.log("[collections_GET]", err);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Quản lý Bộ sưu tập</h1>
        <p className="text-slate-500 mt-1">Quản lý bộ sưu tập và sản phẩm ở trong đó.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh] bg-white rounded-xl shadow-sm border border-slate-200">
          <Loader />
        </div>
      ) : (
        <Card className="border border-slate-200 shadow-md overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-indigo-500/5 border-b border-slate-200 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500 p-2 rounded-lg shadow-sm">
                  <FolderOpen className="text-white h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800">Bộ sưu tập</CardTitle>
                  <p className="text-slate-500 text-sm mt-1">Quản lý các bộ sưu tập</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                  {collections.length} Bộ sưu tập
                </Badge>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={getCollections} 
                  className="hover:bg-slate-100 border-slate-200"
                  title="Refresh collections"
                >
                  <RefreshCw className="h-4 w-4 text-slate-600" />
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => router.push("/collections/new")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo bộ sưu tập mới
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <DataTable columns={columns} data={collections} searchKey="title" />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-slate-200 bg-slate-50 py-3 px-6">
            <div className="flex justify-between w-full text-sm text-slate-500">
              <span>Showing {collections.length} bộ sưu tập</span>
              <span>Ngày cuối cập nhật: {new Date().toLocaleString()}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Collections;