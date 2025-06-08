import Customer from "../models/customer";
import Order from "../models/order";
import { connectToDB } from "../mongoDB"

export const getTotalSales = async () => {
  await connectToDB();
  // Chỉ lấy những đơn hàng có status là "delivered"
  const orders = await Order.find({ status: "delivered" });
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0)
  return { totalOrders, totalRevenue }
}

export const getTotalCustomers = async () => {
  await connectToDB();
  const customers = await Customer.find()
  const totalCustomers = customers.length
  return totalCustomers
}

export const getSalesPerMonth = async () => {
  await connectToDB()
  // Chỉ lấy những đơn hàng có status là "delivered"
  const orders = await Order.find({ status: "delivered" })

  const salesPerMonth = orders.reduce((acc, order) => {
    const monthIndex = new Date(order.createdAt).getMonth(); // 0 for January --> 11 for December
    acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
    // For June
    // acc[5] = (acc[5] || 0) + order.totalAmount (orders have monthIndex 5)
    return acc
  }, {})

  const graphData = Array.from({ length: 12}, (_, i) => {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, i))
    // if i === 5 => month = "Jun"
    return { name: month, sales: salesPerMonth[i] || 0 }
  })

  return graphData
}

// Optional: Nếu bạn muốn giữ lại hàm lấy tất cả orders (bao gồm cả chưa delivered)
export const getAllSales = async () => {
  await connectToDB();
  const orders = await Order.find();
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0)
  return { totalOrders, totalRevenue }
}

export const getAllSalesPerMonth = async () => {
  await connectToDB()
  const orders = await Order.find()

  const salesPerMonth = orders.reduce((acc, order) => {
    const monthIndex = new Date(order.createdAt).getMonth();
    acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
    return acc
  }, {})

  const graphData = Array.from({ length: 12}, (_, i) => {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, i))
    return { name: month, sales: salesPerMonth[i] || 0 }
  })

  return graphData
}