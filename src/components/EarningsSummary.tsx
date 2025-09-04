import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Driver } from "@/types";
import { CurrencyGbp, TrendingUp, Clock, Calendar, Target, Star, Trophy } from "@phosphor-icons/react";

interface EarningsSummaryProps {
  driver: Driver;
}

export function EarningsSummary({ driver }: EarningsSummaryProps) {
  // Calculate some additional metrics (converted to GBP)
  const weeklyGoal = 400; // £400 weekly goal
  const monthlyGoal = 1600; // £1600 monthly goal
  const weeklyProgress = Math.min((driver.earnings.thisWeek / weeklyGoal) * 100, 100);
  const monthlyProgress = Math.min((driver.earnings.thisMonth / monthlyGoal) * 100, 100);
  const avgPerTrip = driver.trips.completed > 0 ? driver.earnings.today / Math.max(driver.trips.completed, 1) : 0;

  return (
    <Card className="animate-fade-in-scale overflow-hidden border shadow-lg">
      <CardHeader className="bg-gradient-to-r from-success/10 via-accent/5 to-primary/10 border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-success to-primary rounded-xl shadow-md">
              <CurrencyGbp size={20} className="text-white" weight="bold" />
            </div>
            <span className="text-lg font-bold">Earnings Summary</span>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border-yellow-400/30">
            <Star size={14} weight="fill" className="text-yellow-600" />
            <span className="font-bold text-yellow-700">{driver.rating.toFixed(1)}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Today's Earnings Highlight */}
        <div className="p-6 bg-gradient-to-br from-success/10 to-accent/10 rounded-xl border border-success/20 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-success to-accent rounded-xl shadow-md">
                <Clock size={24} className="text-white" weight="bold" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-medium mb-1">Today's Earnings</div>
                <div className="text-3xl font-bold text-success flex items-center gap-1">
                  <CurrencyGbp size={28} weight="bold" />
                  {driver.earnings.today.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="text-right bg-white/50 rounded-xl p-3 border border-white/60">
              <div className="text-xl font-bold text-foreground">{driver.trips.completed}</div>
              <div className="text-xs text-muted-foreground font-medium">trips completed</div>
            </div>
          </div>
          
          {avgPerTrip > 0 && (
            <div className="flex items-center justify-between text-sm bg-white/30 rounded-lg p-3">
              <span className="text-muted-foreground font-medium">Average per trip</span>
              <span className="font-bold text-success flex items-center gap-1">
                <CurrencyGbp size={14} weight="bold" />
                {avgPerTrip.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        
        {/* Weekly & Monthly Progress */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-5 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" weight="bold" />
                <span className="font-bold text-base">This Week</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary flex items-center gap-1">
                  <CurrencyGbp size={18} weight="bold" />
                  {driver.earnings.thisWeek.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground font-medium">of £{weeklyGoal} goal</div>
              </div>
            </div>
            <Progress value={weeklyProgress} className="h-3 bg-muted/50" />
            <div className="text-xs text-muted-foreground mt-2 text-center font-medium">
              {weeklyProgress.toFixed(0)}% completed
            </div>
          </div>
          
          <div className="p-5 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-accent" weight="bold" />
                <span className="font-bold text-base">This Month</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-accent flex items-center gap-1">
                  <CurrencyGbp size={18} weight="bold" />
                  {driver.earnings.thisMonth.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground font-medium">of £{monthlyGoal} goal</div>
              </div>
            </div>
            <Progress value={monthlyProgress} className="h-3 bg-muted/50" />
            <div className="text-xs text-muted-foreground mt-2 text-center font-medium">
              {monthlyProgress.toFixed(0)}% completed
            </div>
          </div>
        </div>

        {/* Trip Statistics */}
        <div className="pt-4 border-t border-muted/50">
          <h4 className="font-bold text-base mb-4 flex items-center gap-2">
            <TrendingUp size={18} weight="bold" />
            Trip Statistics
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border border-success/20">
              <div className="text-2xl font-bold text-success mb-1">{driver.trips.completed}</div>
              <div className="text-xs text-muted-foreground font-medium">Completed</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-xl border border-destructive/20">
              <div className="text-2xl font-bold text-destructive mb-1">{driver.trips.cancelled}</div>
              <div className="text-xs text-muted-foreground font-medium">Cancelled</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-300/5 rounded-xl border border-yellow-400/20">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{driver.rating.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground font-medium">Rating</div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/5 rounded-xl border border-accent/20 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target size={18} className="text-accent" weight="bold" />
            <span className="font-bold text-base">Performance Insights</span>
          </div>
          <div className="text-sm text-muted-foreground font-medium">
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