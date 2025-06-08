// import { DataTable } from "@/components/custom ui/DataTable"
// import { columns } from "@/components/orderItems/OrderItemsColums"
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Package, Box } from "lucide-react"

// const OrderDetails = async ({ params }: { params: { orderId: string }}) => {
//   const res = await fetch(`http://localhost:3000/api/orders/${params.orderId}`)
//   const { orderDetails, customer } = await res.json()

//   const { street, city, state, postalCode, country } = orderDetails.customer_details

//   const getShippingRateLabel = (rateId: string): string => {
//   switch (rateId) {
//     case "shr_1RD57OPJC87hP2pXvzwGYmJZ":
//       return "Miễn phí";
//     case "shr_1RD56rPJC87hP2pXbo71F2fF":
//       return "20.000 VND";
//     default:
//       return "Không xác định";
//   }
// };

//   return (
//     <div className="p-6 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-slate-800">Order Details</h1>
//         <p className="text-slate-500 mt-1">Order #{orderDetails._id.slice(0, 8)}...</p>
//       </div>
      
//       <Card className="border border-slate-200 shadow-md overflow-hidden bg-white mb-6">
//         <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border-b border-slate-200 pb-4">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex items-center space-x-3">
//               <div className="bg-indigo-500 p-2 rounded-lg shadow-sm">
//                 <Box className="text-white h-6 w-6" />
//               </div>
//               <div>
//                 <CardTitle className="text-2xl font-bold text-slate-800">Thông tin đơn hàng</CardTitle>
//                 <p className="text-slate-500 text-sm mt-1">Order and customer details</p>
//               </div>
//             </div>
            
//             <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 self-start md:self-auto">
//               {orderDetails.products.length} Products
//             </Badge>
//           </div>
//         </CardHeader>
        
//         <CardContent className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-sm font-semibold text-slate-500 mb-1">ID đơn hàng</h3>
//                 <p className="text-base font-medium text-slate-800">{orderDetails._id}</p>
//               </div>
              
//               <div>
//                 <h3 className="text-sm font-semibold text-slate-500 mb-1">Tên khách hàng</h3>
//                 <p className="text-base font-medium text-slate-800">{customer.name}</p>
//               </div>
              
//               <div>
//                 <h3 className="text-sm font-semibold text-slate-500 mb-1">Tổng tiền</h3>
//                 <p className="text-lg font-bold text-indigo-600">{orderDetails.totalAmount} VND</p>
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-sm font-semibold text-slate-500 mb-1">Địa chỉ giao hàng</h3>
//                 <p className="text-base font-medium text-slate-800">{street}, {city}</p>
//                 <p className="text-base font-medium text-slate-800">{state}, {postalCode}</p>
//                 <p className="text-base font-medium text-slate-800">{country}</p>
//               </div>
              
//               <div>
//                 <h3 className="text-sm font-semibold text-slate-500 mb-1">Chi phí ship</h3>
//                 {/* <p className="text-base font-medium text-slate-800">{orderDetails.shippingRate}</p> */}
//                 <p className="text-base font-medium text-slate-800">{getShippingRateLabel(orderDetails.shippingRate)}</p>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
      
//       <Card className="border border-slate-200 shadow-md overflow-hidden bg-white">
//         <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border-b border-slate-200 pb-4">
//           <div className="flex items-center space-x-3">
//             <div className="bg-indigo-500 p-2 rounded-lg shadow-sm">
//               <Package className="text-white h-6 w-6" />
//             </div>
//             <div>
//               <CardTitle className="text-2xl font-bold text-slate-800">Các sản phẩm trong đơn</CardTitle>
//               <p className="text-slate-500 text-sm mt-1">Products in this order</p>
//             </div>
//           </div>
//         </CardHeader>
        
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <DataTable columns={columns} data={orderDetails.products} searchKey="product"/>
//           </div>
//         </CardContent>
        
//         <CardFooter className="border-t border-slate-200 bg-slate-50 py-3 px-6">
//           <div className="text-sm text-slate-500">
//             <span>Total Items: {orderDetails.products.length}</span>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }

// export default OrderDetails

'use client'

import { useEffect, useState } from 'react'
import { DataTable } from "@/components/custom ui/DataTable"
import { columns } from "@/components/orderItems/OrderItemsColums"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Box, Check, Loader2 } from "lucide-react"
import toast from 'react-hot-toast'

interface OrderDetailsProps {
  params: { orderId: string }
}

const OrderDetails = ({ params }: OrderDetailsProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrderData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.orderId])

  const fetchOrderData = async () => {
    try {
      const res = await fetch(`/api/orders/${params.orderId}`, {
        cache: 'no-store'
      })
      const data = await res.json()
      setOrderData(data)
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Có lỗi khi tải thông tin đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async () => {
    setUpdating(true)
    
    try {
      const response = await fetch(`/api/orders/${params.orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'delivered' }),
      })

      if (response.ok) {
        toast.success('Đã cập nhật trạng thái đơn hàng thành công!', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: 'white',
            fontWeight: '500',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#10B981',
          },
        })
        // Refresh data
        await fetchOrderData()
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật trạng thái', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: 'white',
            fontWeight: '500',
          },
        })
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          fontWeight: '500',
        },
      })
    } finally {
      setUpdating(false)
    }
  }

  const getShippingRateLabel = (rateId: string): string => {
    switch (rateId) {
      case "shr_1RD57OPJC87hP2pXvzwGYmJZ":
        return "Miễn phí";
      case "shr_1RD56rPJC87hP2pXbo71F2fF":
        return "20.000 VND";
      default:
        return "Không xác định";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      processing: { label: "Đang xử lý", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      delivered: { label: "Đã giao", className: "bg-green-100 text-green-800 border-green-300" },
      cancel: { label: "Đã hủy", className: "bg-red-100 text-red-800 border-red-300" },
      refunding: { label: "Đang hoàn tiền", className: "bg-blue-100 text-blue-800 border-blue-300" },
      NotRefund: { label: "Không hoàn tiền", className: "bg-gray-100 text-gray-800 border-gray-300" },
      refunded: { label: "Đã hoàn tiền", className: "bg-purple-100 text-purple-800 border-purple-300" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.processing
    return (
      <Badge variant="outline" className={`px-3 py-1 ${config.className}`}>
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Không thể tải thông tin đơn hàng</p>
        </div>
      </div>
    )
  }

  const { orderDetails, customer } = orderData
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
                <CardTitle className="text-2xl font-bold text-slate-800">Thông tin đơn hàng</CardTitle>
                <p className="text-slate-500 text-sm mt-1">Order and customer details</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {getStatusBadge(orderDetails.status)}
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                {orderDetails.products.length} Products
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-1">ID đơn hàng</h3>
                <p className="text-base font-medium text-slate-800">{orderDetails._id}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-1">Tên khách hàng</h3>
                <p className="text-base font-medium text-slate-800">{customer.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-1">Tổng tiền</h3>
                <p className="text-lg font-bold text-indigo-600">{orderDetails.totalAmount} VND</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-1">Trạng thái đơn hàng</h3>
                <div className="flex items-center gap-3">
                  {getStatusBadge(orderDetails.status)}
                  {orderDetails.status === 'processing' && (
                    <Button
                      onClick={updateOrderStatus}
                      disabled={updating}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 transition-colors duration-200"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang cập nhật...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Đánh dấu đã giao
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-1">Địa chỉ giao hàng</h3>
                <p className="text-base font-medium text-slate-800">{street}, {city}</p>
                <p className="text-base font-medium text-slate-800">{state}, {postalCode}</p>
                <p className="text-base font-medium text-slate-800">{country}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-1">Chi phí ship</h3>
                <p className="text-base font-medium text-slate-800">{getShippingRateLabel(orderDetails.shippingRate)}</p>
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
              <CardTitle className="text-2xl font-bold text-slate-800">Các sản phẩm trong đơn</CardTitle>
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