import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Driver } from "@/types";
import { DollarSign, TrendingUp, Clock, Calendar, Target, Star, Trophy } from "@phosphor-icons/react";

interface EarningsSummaryProps {
  driver: Driver;
}

export function EarningsSummary({ driver }: EarningsSummaryProps) {
  // Calculate some additional metrics
  const weeklyGoal = 500; // Example weekly goal
  const monthlyGoal = 2000; // Example monthly goal
  const weeklyProgress = Math.min((driver.earnings.thisWeek / weeklyGoal) * 100, 100);
  const monthlyProgress = Math.min((driver.earnings.thisMonth / monthlyGoal) * 100, 100);
  const avgPerTrip = driver.trips.completed > 0 ? driver.earnings.today / Math.max(driver.trips.completed, 1) : 0;

  return (
    <Card className="animate-fade-in-scale">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-gradient-to-br from-success to-accent rounded-lg">
              <DollarSign size={20} className="text-white" />
            </div>
            Earnings Summary
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star size={12} weight="fill" className="text-yellow-500" />
            {driver.rating.toFixed(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Today's Earnings Highlight */}
        <div className="p-6 bg-gradient-to-br from-success/10 via-success/5 to-accent/10 rounded-xl border-2 border-success/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-success to-accent rounded-xl shadow-lg">
                <Clock size={24} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-medium">Today's Earnings</div>
                <div className="text-3xl font-bold text-success">${driver.earnings.today.toFixed(2)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-muted-foreground">{driver.trips.completed}</div>
              <div className="text-xs text-muted-foreground">trips</div>
            </div>
          </div>
          
          {avgPerTrip > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Average per trip</span>
              <span className="font-semibold text-success">${avgPerTrip.toFixed(2)}</span>
            </div>
          )}
        </div>
        
        {/* Weekly & Monthly Progress */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-gradient-to-r from-muted/50 to-primary/5 rounded-xl border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span className="font-semibold">This Week</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">${driver.earnings.thisWeek.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">of ${weeklyGoal} goal</div>
              </div>
            </div>
            <Progress value={weeklyProgress} className="h-3" />
            <div className="text-xs text-muted-foreground mt-1 text-center">
              {weeklyProgress.toFixed(0)}% completed
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-muted/50 to-accent/5 rounded-xl border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-accent" />
                <span className="font-semibold">This Month</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-accent">${driver.earnings.thisMonth.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">of ${monthlyGoal} goal</div>
              </div>
            </div>
            <Progress value={monthlyProgress} className="h-3" />
            <div className="text-xs text-muted-foreground mt-1 text-center">
              {monthlyProgress.toFixed(0)}% completed
            </div>
          </div>
        </div>

        {/* Trip Statistics */}
        <div className="pt-4 border-t border-muted">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={16} />
            Trip Statistics
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border">
              <div className="text-2xl font-bold text-success">{driver.trips.completed}</div>
              <div className="text-xs text-muted-foreground font-medium">Completed</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-lg border">
              <div className="text-2xl font-bold text-destructive">{driver.trips.cancelled}</div>
              <div className="text-xs text-muted-foreground font-medium">Cancelled</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border">
              <div className="text-2xl font-bold text-primary">{driver.rating.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground font-medium">Rating</div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="p-4 bg-gradient-to-r from-accent/5 to-primary/5 rounded-xl border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-accent" />
            <span className="font-semibold text-sm">Performance Insights</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {weeklyProgress >= 80 ? (
              <>🎉 Excellent week! You're on track to exceed your weekly goal.</>
            ) : weeklyProgress >= 50 ? (
              <>📈 Good progress! Keep up the momentum to reach your weekly goal.</>
            ) : (
              <>💪 Let's boost those earnings! Consider driving during peak hours.</>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}