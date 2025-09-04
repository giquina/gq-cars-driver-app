import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const earningsData = [
  { month: 'Jan', earnings: 45000, trips: 1200 },
  { month: 'Feb', earnings: 52000, trips: 1350 },
  { month: 'Mar', earnings: 48000, trips: 1280 },
  { month: 'Apr', earnings: 61000, trips: 1450 },
  { month: 'May', earnings: 55000, trips: 1380 },
  { month: 'Jun', earnings: 67000, trips: 1520 },
];

const statusData = [
  { name: 'Active', value: 78, color: 'oklch(0.45 0.15 230)' },
  { name: 'Inactive', value: 15, color: 'oklch(0.7 0.02 230)' },
  { name: 'Suspended', value: 7, color: 'oklch(0.577 0.245 27.325)' },
];

const topDriversData = [
  { name: 'John Smith', earnings: 8500, trips: 245 },
  { name: 'Maria Garcia', earnings: 7800, trips: 220 },
  { name: 'David Chen', earnings: 7200, trips: 210 },
  { name: 'Sarah Wilson', earnings: 6900, trips: 195 },
  { name: 'Mike Johnson', earnings: 6500, trips: 185 },
];

export function EarningsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Earnings & Trips</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 230)" />
            <XAxis dataKey="month" stroke="oklch(0.7 0.02 230)" />
            <YAxis stroke="oklch(0.7 0.02 230)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'oklch(1 0 0)', 
                border: '1px solid oklch(0.9 0.01 230)',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="earnings" 
              stroke="oklch(0.45 0.15 230)" 
              strokeWidth={3}
              dot={{ fill: 'oklch(0.45 0.15 230)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
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
        <ResponsiveContainer width="100%" height={300}>
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
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-4">
          {statusData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topDriversData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 230)" />
            <XAxis type="number" stroke="oklch(0.7 0.02 230)" />
            <YAxis dataKey="name" type="category" stroke="oklch(0.7 0.02 230)" width={80} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'oklch(1 0 0)', 
                border: '1px solid oklch(0.9 0.01 230)',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey="earnings" 
              fill="oklch(0.65 0.15 45)" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}