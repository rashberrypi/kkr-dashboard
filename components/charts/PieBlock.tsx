"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { COLORS, TOOLTIP_STYLE } from "@/lib/theme";

export default function PieBlock({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="_id"
          outerRadius={110}
          innerRadius={60}
          paddingAngle={3}
        >
          {data.map((_: any, i: number) => (
            <Cell
              key={i}
              fill={COLORS[i % COLORS.length]}
              stroke="transparent"
            />
          ))}
        </Pie>

        <Tooltip contentStyle={TOOLTIP_STYLE} />

        <Legend
          verticalAlign="bottom"
          height={40}
          formatter={(value) => (
            <span style={{ color: "#999", fontSize: "13px" }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}