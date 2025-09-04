import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Driver } from "@/types";
import { DollarSign, TrendingUp, Clock, Calendar } from "@phosphor-icons/react";

interface EarningsSummaryProps {
  driver: Driver;
}

export function EarningsSummary({ driver }: EarningsSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign size={20} />
          Earnings Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Clock size={16} className="text-accent" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Today</div>
                <div className="text-2xl font-bold text-accent">${driver.earnings.today.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">This Week</div>
              <div className="text-xl font-bold">${driver.earnings.thisWeek.toFixed(2)}</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">This Month</div>
              <div className="text-xl font-bold">${driver.earnings.thisMonth.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{driver.trips.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{driver.trips.cancelled}</div>
              <div className="text-sm text-muted-foreground">Cancelled</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}