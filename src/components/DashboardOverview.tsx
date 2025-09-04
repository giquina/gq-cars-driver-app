import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  Car, 
  Star,
  TrendingUp
} from "@phosphor-icons/react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function MetricCard({ title, value, icon, change, changeType = 'neutral' }: MetricCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div className={`text-xs flex items-center gap-1 mt-1 ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 
            'text-muted-foreground'
          }`}>
            {changeType === 'positive' && <TrendingUp size={12} />}
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardOverviewProps {
  metrics: {
    totalDrivers: number;
    activeDrivers: number;
    totalEarnings: number;
    totalTrips: number;
    averageRating: number;
  };
}

export function DashboardOverview({ metrics }: DashboardOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <MetricCard
        title="Total Drivers"
        value={metrics.totalDrivers}
        icon={<Users size={20} />}
      />
      <MetricCard
        title="Active Drivers"
        value={metrics.activeDrivers}
        icon={<UserCheck size={20} />}
        change={`${Math.round((metrics.activeDrivers / metrics.totalDrivers) * 100)}% of total`}
        changeType="neutral"
      />
      <MetricCard
        title="Total Earnings"
        value={formatCurrency(metrics.totalEarnings)}
        icon={<DollarSign size={20} />}
        change="+12% from last month"
        changeType="positive"
      />
      <MetricCard
        title="Total Trips"
        value={metrics.totalTrips.toLocaleString()}
        icon={<Car size={20} />}
        change="+8% from last month"
        changeType="positive"
      />
      <MetricCard
        title="Average Rating"
        value={metrics.averageRating.toFixed(1)}
        icon={<Star size={20} />}
        change="Excellent service"
        changeType="positive"
      />
    </div>
  );
}