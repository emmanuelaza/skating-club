'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface SlicePoint {
  name: string;
  value: number;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
  'hsl(244 70% 70%)',
  'hsl(var(--muted-foreground))',
];

interface TooltipPayload {
  name: string;
  value: number;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const slice = payload[0];
  if (!slice) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-popover-foreground">{slice.name}</p>
      <p className="text-muted-foreground">{slice.value} asistencias</p>
    </div>
  );
}

export function AttendancePie({ data }: { data: SlicePoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        Sin asistencias en el rango.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((slice, index) => (
            <Cell key={slice.name} fill={COLORS[index % COLORS.length]} stroke="hsl(var(--card))" />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend
          formatter={(value: string) => <span className="text-sm text-muted-foreground">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
