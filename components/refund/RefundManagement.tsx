"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Receipt, User, Calendar, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ExtendedRefundType {
  _id: string;
  orderId: {
    _id: string;
    customerClerkId: string;
    products: ProductType[];
    totalAmount: number;
    createdAt: string;
  };
  customerClerkId: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const Refunds = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refunds, setRefunds] = useState<ExtendedRefundType[]>([]);
  const [filteredRefunds, setFilteredRefunds] = useState<ExtendedRefundType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingRefund, setProcessingRefund] = useState<string | null>(null);

  const getRefunds = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/refunds`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${res.status}`);
      }
      const data = await res.json();
      setRefunds(data);
      setFilteredRefunds(data);
      setLoading(false);
    } catch (err) {
      console.error("[refunds_GET]", err);
      setLoading(false);
      toast.error("Không thể tải danh sách yêu cầu hoàn tiền");
    }
  }, []);

  const handleRefundAction = async (refundId: string, action: "approve" | "reject") => {
  try {
    setProcessingRefund(refundId);
    console.log(`=== FRONTEND REQUEST ===`);
    console.log(`RefundId: ${refundId}`);
    console.log(`Action: ${action}`);
    console.log(`URL: /api/refunds/${refundId}`);
    
    const res = await fetch(`/api/refunds/${refundId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ action }),
    });

    console.log(`=== RESPONSE INFO ===`);
    console.log(`Status: ${res.status}`);
    console.log(`StatusText: ${res.statusText}`);
    console.log(`Headers:`, Object.fromEntries(res.headers.entries()));

    if (res.ok) {
      const responseData = await res.json();
      console.log(`=== SUCCESS RESPONSE ===`, responseData);
      toast.success(`Yêu cầu hoàn tiền đã được ${action === "approve" ? "chấp nhận" : "từ chối"} thành công`);
      await getRefunds();
    } else {
      // Kiểm tra content type trước khi parse
      const contentType = res.headers.get('content-type');
      console.log(`=== ERROR RESPONSE ===`);
      console.log(`Content-Type: ${contentType}`);
      
      let errorData;
      if (contentType && contentType.includes('application/json')) {
        errorData = await res.json();
        console.log(`Error JSON:`, errorData);
      } else {
        const errorText = await res.text();
        console.log(`Error Text:`, errorText);
        errorData = { message: `Server error (${res.status})` };
      }
      
      toast.error(`Lỗi khi ${action === "approve" ? "chấp nhận" : "từ chối"} yêu cầu hoàn tiền: ${errorData.message || "Lỗi không xác định"}`);
    }
  } catch (err) {
    console.error(`=== CATCH ERROR ===`);
    console.error(`Action: ${action}`);
    console.error(`Error:`, err);
    toast.error(`Lỗi kết nối khi ${action === "approve" ? "chấp nhận" : "từ chối"} yêu cầu hoàn tiền`);
  } finally {
    setProcessingRefund(null);
  }
};

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    applyFilters(searchTerm, value);
  };

  const applyFilters = (search: string, status: string) => {
    let filtered = refunds;

    if (status !== "all") {
      filtered = filtered.filter((refund) => refund.status === status);
    }

    if (search.trim() !== "") {
      filtered = filtered.filter(
        (refund) =>
          refund.reason.toLowerCase().includes(search.toLowerCase()) ||
          refund.customerClerkId.toLowerCase().includes(search.toLowerCase()) ||
          refund.orderId._id.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredRefunds(filtered);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        variant: "secondary" as const,
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <Clock className="h-3 w-3" />,
      },
      approved: {
        variant: "secondary" as const,
        className: "bg-green-50 text-green-700 border-green-200",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      rejected: {
        variant: "secondary" as const,
        className: "bg-red-50 text-red-700 border-red-200",
        icon: <XCircle className="h-3 w-3" />,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={`${config.className} flex items-center gap-1`}>
        {config.icon}
        {status === "pending" ? "Đang chờ" : status === "approved" ? "Đã chấp nhận" : "Đã từ chối"}
      </Badge>
    );
  };

  const getStatusStats = () => {
    const stats = {
      pending: refunds.filter((r) => r.status === "pending").length,
      approved: refunds.filter((r) => r.status === "approved").length,
      rejected: refunds.filter((r) => r.status === "rejected").length,
    };
    return stats;
  };

  useEffect(() => {
    getRefunds();
  }, [getRefunds]);

  const stats = getStatusStats();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Quản lý hoàn tiền</h1>
        <p className="text-slate-500 mt-1">Quản lý các yêu cầu hoàn tiền của khách hàng</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh] bg-white rounded-xl shadow-sm border border-slate-200">
          <Loader />
        </div>
      ) : (
        <Card className="border border-slate-200 shadow-md overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/5 border-b border-slate-200 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 p-2 rounded-lg shadow-sm">
                  <Receipt className="text-white h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800">Yêu cầu hoàn tiền</CardTitle>
                  <p className="text-slate-500 text-sm mt-1">Xem xét và xử lý các yêu cầu hoàn tiền</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1">
                    Đang chờ: {stats.pending}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                    Đã chấp nhận: {stats.approved}
                  </Badge>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1">
                    Đã từ chối: {stats.rejected}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => getRefunds()}
                  className="hover:bg-slate-100 border-slate-200"
                  title="Làm mới danh sách"
                >
                  <RefreshCw className="h-4 w-4 text-slate-600" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Tìm kiếm theo lý do, ID khách hàng hoặc ID đơn hàng..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-[180px] h-10 px-3 py-2 border border-slate-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Đang chờ</option>
                <option value="approved">Đã chấp nhận</option>
                <option value="rejected">Đã từ chối</option>
              </select>
            </div>

            {filteredRefunds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <Receipt className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">Không tìm thấy yêu cầu hoàn tiền</h3>
                <p className="text-slate-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc."
                    : "Chưa có yêu cầu hoàn tiền nào được gửi."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRefunds.map((refund) => (
                  <Card key={refund._id} className="border border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-slate-100 p-2 rounded-full">
                            <User className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">ID khách hàng: {refund.customerClerkId}</h4>
                            <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(refund.createdAt)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-3 w-3" />
                                <span>{formatCurrency(refund.orderId.totalAmount)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">{getStatusBadge(refund.status)}</div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">ID đơn hàng:</p>
                          <p className="text-sm text-slate-800 font-mono">{refund.orderId._id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">Sản phẩm:</p>
                          <p className="text-sm text-slate-800">{refund.orderId.products.length} mặt hàng</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-slate-600 mb-2">Lý do hoàn tiền:</p>
                        <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg">{refund.reason}</p>
                      </div>

                      {refund.status === "pending" && (
                        <div className="flex gap-2 pt-2 border-t border-slate-200">
                          <Button
                            onClick={() => handleRefundAction(refund._id, "approve")}
                            disabled={processingRefund === refund._id}
                            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                            size="sm"
                          >
                            <CheckCircle className="h-4 w-4" />
                            {processingRefund === refund._id ? "Đang xử lý..." : "Chấp nhận"}
                          </Button>
                          <Button
                            onClick={() => handleRefundAction(refund._id, "reject")}
                            disabled={processingRefund === refund._id}
                            variant="destructive"
                            className="flex items-center gap-2"
                            size="sm"
                          >
                            <XCircle className="h-4 w-4" />
                            {processingRefund === refund._id ? "Đang xử lý..." : "Từ chối"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t border-slate-200 bg-slate-50 py-3 px-6">
            <div className="flex justify-between w-full text-sm text-slate-500">
              <span>Hiển thị {filteredRefunds.length} trong số {refunds.length} yêu cầu hoàn tiền</span>
              <span>Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Refunds;