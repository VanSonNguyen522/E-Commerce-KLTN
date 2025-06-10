"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RefreshCw, MessageSquare, Trash2, User, Calendar } from "lucide-react";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";


interface CommentType {
  _id: string;
  clerkId?: string;
  name: string;
  content: string;
  productId: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

const Comments = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [filteredComments, setFilteredComments] = useState<CommentType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  const getComments = async (productId?: string) => {
    try {
      setLoading(true);
      const url = productId ? `/api/comments?productId=${productId}` : "/api/comments";
      const res = await fetch(url, {
        method: "GET",
      });
      const data = await res.json();
      setComments(data);
      setFilteredComments(data);
      setLoading(false);
    } catch (err) {
      console.log("[comments_GET]", err);
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: commentId }),
      });

      if (res.ok) {
        getComments(selectedProductId);
      }
    } catch (err) {
      console.log("[comments_DELETE]", err);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredComments(comments);
    } else {
      const filtered = comments.filter(
        (comment) =>
          comment.name.toLowerCase().includes(value.toLowerCase()) ||
          comment.content.toLowerCase().includes(value.toLowerCase()) ||
          comment.productId.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredComments(filtered);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Quản lý Bình luận khách hàng</h1>
        <p className="text-slate-500 mt-1">Quản lý bình luận của sản phẩm và giới thiệu</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh] bg-white rounded-xl shadow-sm border border-slate-200">
          <Loader />
        </div>
      ) : (
        <Card className="border border-slate-200 shadow-md overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border-b border-slate-200 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg shadow-sm">
                  <MessageSquare className="text-white h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800">Bình luận</CardTitle>
                  <p className="text-slate-500 text-sm mt-1">Xem và quản lý bình luận từ khách hàng.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                  {filteredComments.length} Bình luận
                </Badge>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => getComments(selectedProductId)} 
                  className="hover:bg-slate-100 border-slate-200"
                  title="Refresh comments"
                >
                  <RefreshCw className="h-4 w-4 text-slate-600" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="mb-6">
              <Input
                placeholder="Search comments by name, content, or product..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {filteredComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <MessageSquare className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">Không bình luận nào được tìm thấy</h3>
                <p className="text-slate-500">
                  {searchTerm ? "Try adjusting your search terms." : "No comments have been posted yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComments.map((comment) => (
                  <Card key={comment._id} className="border border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="bg-slate-100 p-2 rounded-full">
                            <User className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{comment.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(comment.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteComment(comment._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="mb-3">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                          {comment.productId.title}
                        </Badge>
                      </div>
                      
                      <p className="text-slate-700 leading-relaxed">
                        {comment.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t border-slate-200 bg-slate-50 py-3 px-6">
            <div className="flex justify-between w-full text-sm text-slate-500">
              <span>Showing {filteredComments.length} of {comments.length} bình luận</span>
              <span>Ngày cuối cập nhật: {new Date().toLocaleString()}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Comments;