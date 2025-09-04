import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const earningsData = [
  { month: 'Jan', earnings: 45000, trips: 1200 },
  { month: 'Feb', earnings: 52000, trips: 1350 },
  { month: 'Mar', earnings: 48000, trips: 1280 },
  { month: 'Apr', earnings: 61000, trips: 1450 },
  { month: 'May', earnings: 55000, trips: 1380 },
  { month: 'Jun', earnings: 67000, trips: 1520 },
];

const statusData = [
  { name: 'Active', value: 78, fill: 'var(--color-active)' },
  { name: 'Inactive', value: 15, fill: 'var(--color-inactive)' },
  { name: 'Suspended', value: 7, fill: 'var(--color-suspended)' },
];

const topDriversData = [
  { name: 'John Smith', earnings: 8500, trips: 245 },
  { name: 'Maria Garcia', earnings: 7800, trips: 220 },
  { name: 'David Chen', earnings: 7200, trips: 210 },
  { name: 'Sarah Wilson', earnings: 6900, trips: 195 },
  { name: 'Mike Johnson', earnings: 6500, trips: 185 },
];

const earningsChartConfig = {
  earnings: {
    label: "Earnings",
    color: "hsl(var(--chart-1))",
  },
};

const statusChartConfig = {
  active: {
    label: "Active",
    color: "oklch(0.45 0.15 230)",
  },
  inactive: {
    label: "Inactive", 
    color: "oklch(0.7 0.02 230)",
  },
  suspended: {
    label: "Suspended",
    color: "oklch(0.577 0.245 27.325)",
  },
};

const topDriversChartConfig = {
  earnings: {
    label: "Earnings",
    color: "oklch(0.65 0.15 45)",
  },
};

export function EarningsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Earnings & Trips</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={earningsChartConfig}>
          <LineChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="earnings" 
              stroke="var(--color-earnings)"
              strokeWidth={3}
              dot={{
                fill: "var(--color-earnings)",
                strokeWidth: 2,
                r: 6,
              }}
              activeDot={{
                r: 8,
                stroke: "var(--color-earnings)",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function DriverStatusChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={statusChartConfig}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
        <div className="flex justify-center gap-4 mt-4">
          {statusData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name} ({entry.value}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TopDriversChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Drivers</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={topDriversChartConfig}>
          <BarChart data={topDriversData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis 
              dataKey="name" 
              type="category" 
              tickLine={false} 
              axisLine={false} 
              width={80} 
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="earnings" 
              fill="var(--color-earnings)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}