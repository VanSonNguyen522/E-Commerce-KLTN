"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  Legend,
} from "recharts";

// Define the data shape for TypeScript
interface SalesData {
  name: string; // e.g., "Jan", "Feb"
  sales: number; // Sales in VND
}

const SalesChart = ({ data }: { data: SalesData[] }) => {
  // Find max value for better Y-axis scaling
  const maxSales = Math.max(...data.map(item => item.sales));
  const yAxisMax = Math.ceil(maxSales * 1.2 / 50000) * 50000; // Round up to nearest 50,000

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, bottom: 10, left: 10 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`}
            domain={[0, yAxisMax]} 
            padding={{ top: 20 }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toLocaleString()} VND`, "Revenue"]}
            labelFormatter={(label: string) => `${label}`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              padding: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="sales" 
            name="Revenue" 
            stroke="#8884d8" 
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSales)" 
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;