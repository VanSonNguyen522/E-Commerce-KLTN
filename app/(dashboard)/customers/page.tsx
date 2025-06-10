import { DataTable } from '@/components/custom ui/DataTable'
import { columns } from '@/components/customers/CustomerColumns'
import { Separator } from '@/components/ui/separator'
import Customer from '@/lib/models/customer'
import { connectToDB } from '@/lib/mongoDB'
import { Users, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Customers = async () => {
  await connectToDB()

  const customers = await Customer.find().sort({ createdAt: "desc" })

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Quản lý người dùng</h1>
        <p className="text-slate-500 mt-1">Xem và quản lý người dùng.</p>
      </div>

      <Card className="border border-slate-200 shadow-md overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border-b border-slate-200 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-cyan-500 p-2 rounded-lg shadow-sm">
                <Users className="text-white h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">Khách hàng</CardTitle>
                <p className="text-slate-500 text-sm mt-1">Danh sách khách hàng đã mua hàng trong hệ thống.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                {customers.length} Khách hàng
              </Badge>
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:bg-slate-100 border-slate-200"
                title="Refresh customers"
              >
                <RefreshCw className="h-4 w-4 text-slate-600" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <DataTable columns={columns} data={customers} searchKey="name" />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-slate-200 bg-slate-50 py-3 px-6">
          <div className="flex justify-between w-full text-sm text-slate-500">
            <span>Showing {customers.length} khách hàng</span>
            <span>Ngày cuối cập nhật: {new Date().toLocaleString()}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export const dynamic = "force-dynamic";

export default Customers