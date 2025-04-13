"use client"

import { DataTable } from "@/components/custom ui/DataTable"
import Loader from "@/components/custom ui/Loader"
import { columns } from "@/components/orders/OrderColumns"
import { useEffect, useState } from "react"
import { Package, RefreshCw, Filter, ArrowDownUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// No need to define Order interface as we'll use OrderColumnType

const Orders = () => {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderColumnType[]>([])
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const getOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/orders`)
      const data = await res.json()
      console.log("Fetched orders data:", data); // Debug log
      setOrders(data)
      setLoading(false)
    } catch (err) {
      console.log("[orders_GET]", err)
      setLoading(false)
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  // Function to sort orders by totalAmount
  const sortByTotalAmount = () => {
    try {
      console.log("Before sort:", orders); // Debug log
      
      // Create a deep copy of the orders array
      const sortedOrders = [...orders].sort((a, b) => {
        // Convert values to numbers to ensure proper comparison
        const amountA = Number(a.totalAmount || 0);
        const amountB = Number(b.totalAmount || 0);
        
        if (sortDirection === "asc") {
          return amountA - amountB;
        } else {
          return amountB - amountA;
        }
      });
      
      console.log("After sort:", sortedOrders); // Debug log
      setOrders(sortedOrders);
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } catch (error) {
      console.error("Error during sort operation:", error);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage your orders and track inventory</p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh] bg-white rounded-xl shadow-sm border border-slate-200">
          <Loader />
        </div>
      ) : (
        <Card className="border border-slate-200 shadow-md overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border-b border-slate-200 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-500 p-2 rounded-lg shadow-sm">
                  <Package className="text-white h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800">Orders</CardTitle>
                  <p className="text-slate-500 text-sm mt-1">Manage customer orders and shipping details</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                  {orders.length} Orders
                </Badge>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={getOrders} 
                  className="hover:bg-slate-100 border-slate-200"
                  title="Refresh orders"
                >
                  <RefreshCw className="h-4 w-4 text-slate-600" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Filter className="h-4 w-4" />
                <span>Filter and manage your order list</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs bg-white border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center"
                  onClick={sortByTotalAmount}
                >
                  <ArrowDownUp className="h-3 w-3 mr-1" />
                  Sort by {sortDirection === "asc" ? "Lowest" : "Highest"} Price
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <DataTable 
                columns={columns} 
                data={orders} 
                searchKey="_id" 
              />
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-slate-200 bg-slate-50 py-3 px-6">
            <div className="flex justify-between w-full text-sm text-slate-500">
              <span>Showing {orders.length} orders</span>
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export const dynamic = "force-dynamic";

export default Orders