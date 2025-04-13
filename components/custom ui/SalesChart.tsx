"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Define the data shape for TypeScript
interface SalesData {
  name: string; // e.g., "Jan", "Feb"
  sales: number; // Sales in VND
}

const SalesChart = ({ data }: { data: SalesData[] }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Sales Chart (VND)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
        >
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toLocaleString()}`}
            domain={[0, 200000]} // Match the chart's max Y value
          />
          <Tooltip
            formatter={(value: number) => `${value.toLocaleString()} VND`}
            labelFormatter={(label: string) => `${label}`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              padding: "5px",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;