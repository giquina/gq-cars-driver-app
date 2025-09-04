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
    <Card className="animate-fade-in-scale overflow-hidden border shadow-md">
      <CardHeader className="bg-gradient-to-r from-success/10 via-accent/5 to-primary/10 border-b p-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-success to-primary rounded-lg shadow-sm">
              <CurrencyGbp size={14} className="text-white" weight="bold" />
            </div>
            <span className="text-sm font-bold">Your Earnings</span>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border-yellow-400/30">
            <Star size={10} weight="fill" className="text-yellow-600" />
            <span className="font-bold text-yellow-700 text-xs">{driver.rating.toFixed(1)}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        {/* Today's Earnings Highlight */}
        <div className="p-3 bg-gradient-to-br from-success/10 to-accent/10 rounded-lg border border-success/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-success to-accent rounded-lg shadow-sm">
                <Clock size={16} className="text-white" weight="bold" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-medium mb-0.5">Today's Earnings</div>
                <div className="text-lg font-bold text-success flex items-center gap-1">
                  <CurrencyGbp size={16} weight="bold" />
                  {driver.earnings.today.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="text-right bg-white/50 rounded-lg p-2 border border-white/60">
              <div className="text-sm font-bold text-foreground">{driver.trips.completed}</div>
              <div className="text-[8px] text-muted-foreground font-medium">trips today</div>
            </div>
          </div>
          
          {avgPerTrip > 0 && (
            <div className="flex items-center justify-between text-xs bg-white/30 rounded p-2">
              <span className="text-muted-foreground font-medium">Per trip</span>
              <span className="font-bold text-success flex items-center gap-0.5">
                <CurrencyGbp size={10} weight="bold" />
                {avgPerTrip.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        
        {/* Weekly & Monthly Progress */}
        <div className="grid grid-cols-1 gap-2">
          <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-primary" weight="bold" />
                <span className="font-bold text-xs">This Week</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-primary flex items-center gap-0.5">
                  <CurrencyGbp size={12} weight="bold" />
                  {driver.earnings.thisWeek.toFixed(2)}
                </div>
                <div className="text-[8px] text-muted-foreground font-medium">of £{weeklyGoal} goal</div>
              </div>
            </div>
            <Progress value={weeklyProgress} className="h-2 bg-muted/50" />
            <div className="text-[8px] text-muted-foreground mt-1 text-center font-medium">
              {weeklyProgress.toFixed(0)}% completed
            </div>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Trophy size={12} className="text-accent" weight="bold" />
                <span className="font-bold text-xs">This Month</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-accent flex items-center gap-0.5">
                  <CurrencyGbp size={12} weight="bold" />
                  {driver.earnings.thisMonth.toFixed(2)}
                </div>
                <div className="text-[8px] text-muted-foreground font-medium">of £{monthlyGoal} goal</div>
              </div>
            </div>
            <Progress value={monthlyProgress} className="h-2 bg-muted/50" />
            <div className="text-[8px] text-muted-foreground mt-1 text-center font-medium">
              {monthlyProgress.toFixed(0)}% completed
            </div>
          </div>
        </div>

        {/* Trip Statistics */}
        <div className="pt-2 border-t border-muted/50">
          <h4 className="font-bold text-xs mb-2 flex items-center gap-1">
            <TrendingUp size={12} weight="bold" />
            Trip Stats
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-gradient-to-br from-success/10 to-success/5 rounded border border-success/20">
              <div className="text-sm font-bold text-success mb-0.5">{driver.trips.completed}</div>
              <div className="text-[8px] text-muted-foreground font-medium">Done</div>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded border border-destructive/20">
              <div className="text-sm font-bold text-destructive mb-0.5">{driver.trips.cancelled}</div>
              <div className="text-[8px] text-muted-foreground font-medium">Cancelled</div>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-yellow-500/10 to-yellow-300/5 rounded border border-yellow-400/20">
              <div className="text-sm font-bold text-yellow-600 mb-0.5">{driver.rating.toFixed(1)}</div>
              <div className="text-[8px] text-muted-foreground font-medium">Rating</div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="p-2 bg-gradient-to-r from-accent/10 to-primary/5 rounded border border-accent/20 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <Target size={12} className="text-accent" weight="bold" />
            <span className="font-bold text-xs">Quick Tip</span>
          </div>
          <div className="text-[10px] text-muted-foreground font-medium">
            {weeklyProgress >= 80 ? (
              <>🎉 Great week! You're doing amazing!</>
            ) : weeklyProgress >= 50 ? (
              <>📈 Good progress! Keep it up!</>
            ) : (
              <>💪 Drive during busy hours for more rides!</>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}