import { DataTable } from "@/components/custom ui/DataTable"
import { columns } from "@/components/orderItems/OrderItemsColums"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Box } from "lucide-react"

const OrderDetails = async ({ params }: { params: { orderId: string }}) => {
  const res = await fetch(`http://localhost:3000/api/orders/${params.orderId}`)
  const { orderDetails, customer } = await res.json()

  const { street, city, state, postalCode, country } = orderDetails.customer_details

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Order Details</h1>
        <p className="text-slate-500 mt-1">Order #{orderDetails._id.slice(0, 8)}...</p>
      </div>
      
      <Card className="border border-slate-200 shadow-md overflow-hidden bg-white mb-6">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border-b border-slate-200 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-500 p-2 rounded-lg shadow-sm">
                <Box className="text-white h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">Order Information</CardTitle>
                <p className="text-slate-500 text-sm mt-1">Order and customer details</p>
              </div>
            </div>
            
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 self-start md:self-auto">
              {orderDetails.products.length} Products
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-1">Order ID</h3>
                <p className="text-base font-medium text-slate-800">{orderDetails._id}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-1">Customer Name</h3>
                <p className="text-base font-medium text-slate-800">{customer.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-1">Total Paid</h3>
                <p className="text-lg font-bold text-indigo-600">{orderDetails.totalAmount} VND</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-1">Shipping Address</h3>
                <p className="text-base font-medium text-slate-800">{street}, {city}</p>
                <p className="text-base font-medium text-slate-800">{state}, {postalCode}</p>
                <p className="text-base font-medium text-slate-800">{country}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-1">Shipping Rate ID</h3>
                <p className="text-base font-medium text-slate-800">{orderDetails.shippingRate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-slate-200 shadow-md overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-500 p-2 rounded-lg shadow-sm">
              <Package className="text-white h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">Order Items</CardTitle>
              <p className="text-slate-500 text-sm mt-1">Products in this order</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={orderDetails.products} searchKey="product"/>
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-slate-200 bg-slate-50 py-3 px-6">
          <div className="text-sm text-slate-500">
            <span>Total Items: {orderDetails.products.length}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default OrderDetails