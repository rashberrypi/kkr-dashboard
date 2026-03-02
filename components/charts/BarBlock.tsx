"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TOOLTIP_STYLE } from "@/lib/theme";

export default function BarBlock({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barCategoryGap="35%">
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#141414"
          vertical={false}
        />

        <XAxis
          dataKey="_id"
          tick={{ fill: "#555", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fill: "#555", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          cursor={{ fill: "#E900FF11" }}
        />

        <Bar
          dataKey="count"
          fill="#E900FF"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}