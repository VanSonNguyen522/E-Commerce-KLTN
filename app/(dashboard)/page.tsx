import SalesChart from "@/components/custom ui/SalesChart";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/actions";
import { CircleDollarSign, ShoppingBag, UserRound, BarChart3 } from "lucide-react";

export default async function Home() {
  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  const totalCustomers = await getTotalCustomers();

  const graphData = await getSalesPerMonth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Bảng quản lý và thống kê</h1>
        <p className="text-slate-500 mt-1">Thống kê và quản lý việc kinh doanh</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md border border-slate-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border-b border-slate-200 py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-slate-700 text-lg">Tổng thu nhập</CardTitle>
              <div className="bg-blue-500 p-2 rounded-lg shadow-sm">
                <CircleDollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-2">
            <p className="text-3xl font-bold text-slate-800">{formatCurrency(totalRevenue)} VND</p>
          </CardContent>
          <CardFooter className="pt-0 pb-4">
            <p className="text-xs text-slate-500">Tất cả thu nhập từ đơn hàng thành công</p>
          </CardFooter>
        </Card>

        <Card className="shadow-md border border-slate-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border-b border-slate-200 py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-slate-700 text-lg">Tổng đơn hàng</CardTitle>
              <div className="bg-indigo-500 p-2 rounded-lg shadow-sm">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-2">
            <p className="text-3xl font-bold text-slate-800">{totalOrders}</p>
          </CardContent>
          <CardFooter className="pt-0 pb-4">
            <p className="text-xs text-slate-500">Tổng số đơn hàng đã giao thành công</p>
          </CardFooter>
        </Card>

        <Card className="shadow-md border border-slate-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-b border-slate-200 py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-slate-700 text-lg">Tổng khách hàng</CardTitle>
              <div className="bg-green-500 p-2 rounded-lg shadow-sm">
                <UserRound className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-2">
            <p className="text-3xl font-bold text-slate-800">{totalCustomers}</p>
          </CardContent>
          <CardFooter className="pt-0 pb-4">
            <p className="text-xs text-slate-500">Tổng số khách hàng đã mua hàng.</p>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-8 shadow-md border border-slate-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-indigo-500/5 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-slate-700 text-xl">Doanh thu theo tháng</CardTitle>
              <p className="text-slate-500 text-sm mt-1">Doanh thu theo tháng của năm</p>
            </div>
            <div className="bg-purple-500 p-2 rounded-lg shadow-sm">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <SalesChart data={graphData} />
        </CardContent>
        <CardFooter className="border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
          Ngày cuối cập nhật: {new Date().toLocaleString()}
        </CardFooter>
      </Card>
    </div>
  )
}