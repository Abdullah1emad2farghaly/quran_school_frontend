import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function DonutChart({ data, colors, centerLabel, centerValue }) {
  return (
    <div className="relative w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={56}
            outerRadius={78}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-extrabold text-ink tabular">{centerValue}</span>
        <span className="text-[11px] font-semibold text-ink-faint">{centerLabel}</span>
      </div>
    </div>
  );
}
