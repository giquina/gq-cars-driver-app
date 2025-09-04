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
    <Card className="animate-fade-in-scale border">
      <CardHeader className="bg-success/10 border-b p-1.5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-gradient-to-br from-success to-primary rounded-lg">
              <CurrencyGbp size={10} className="text-white" />
            </div>
            <span className="text-xs font-bold">Your Money</span>
          </div>
          <Badge variant="secondary" className="flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-400/20">
            <Star size={8} weight="fill" className="text-yellow-600" />
            <span className="font-bold text-yellow-700 text-[8px]">{driver.rating.toFixed(1)}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-2">
        {/* Today's Earnings Highlight */}
        <div className="p-2 bg-success/10 rounded border border-success/20">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-gradient-to-br from-success to-accent rounded">
                <Clock size={12} className="text-white" />
              </div>
              <div>
                <div className="text-[8px] text-muted-foreground mb-0.5">Today</div>
                <div className="text-sm font-bold text-success flex items-center gap-0.5">
                  <CurrencyGbp size={12} />
                  {driver.earnings.today.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="text-right bg-white/50 rounded p-1 border border-white/60">
              <div className="text-[10px] font-bold text-foreground">{driver.trips.completed}</div>
              <div className="text-[7px] text-muted-foreground">trips</div>
            </div>
          </div>
          
          {avgPerTrip > 0 && (
            <div className="flex items-center justify-between text-[9px] bg-white/30 rounded p-1">
              <span className="text-muted-foreground">Per trip</span>
              <span className="font-bold text-success flex items-center gap-0.5">
                <CurrencyGbp size={8} />
                {avgPerTrip.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        
        {/* Weekly & Monthly Progress */}
        <div className="grid grid-cols-1 gap-1.5">
          <div className="p-2 bg-primary/10 rounded border border-primary/20">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Calendar size={10} className="text-primary" />
                <span className="font-bold text-[9px]">This Week</span>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                  <CurrencyGbp size={8} />
                  {driver.earnings.thisWeek.toFixed(2)}
                </div>
                <div className="text-[7px] text-muted-foreground">of £{weeklyGoal}</div>
              </div>
            </div>
            <Progress value={weeklyProgress} className="h-1.5 bg-muted/50" />
            <div className="text-[7px] text-muted-foreground mt-0.5 text-center">
              {weeklyProgress.toFixed(0)}% done
            </div>
          </div>
          
          <div className="p-2 bg-accent/10 rounded border border-accent/20">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Trophy size={10} className="text-accent" />
                <span className="font-bold text-[9px]">This Month</span>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-accent flex items-center gap-0.5">
                  <CurrencyGbp size={8} />
                  {driver.earnings.thisMonth.toFixed(2)}
                </div>
                <div className="text-[7px] text-muted-foreground">of £{monthlyGoal}</div>
              </div>
            </div>
            <Progress value={monthlyProgress} className="h-1.5 bg-muted/50" />
            <div className="text-[7px] text-muted-foreground mt-0.5 text-center">
              {monthlyProgress.toFixed(0)}% done
            </div>
          </div>
        </div>

        {/* Trip Statistics */}
        <div className="pt-1.5 border-t border-muted/50">
          <h4 className="font-bold text-[9px] mb-1 flex items-center gap-1">
            <TrendingUp size={10} />
            Your Stats
          </h4>
          <div className="grid grid-cols-3 gap-1">
            <div className="text-center p-1 bg-success/10 rounded border border-success/20">
              <div className="text-[10px] font-bold text-success mb-0.5">{driver.trips.completed}</div>
              <div className="text-[7px] text-muted-foreground">Done</div>
            </div>
            <div className="text-center p-1 bg-destructive/10 rounded border border-destructive/20">
              <div className="text-[10px] font-bold text-destructive mb-0.5">{driver.trips.cancelled}</div>
              <div className="text-[7px] text-muted-foreground">Missed</div>
            </div>
            <div className="text-center p-1 bg-yellow-500/10 rounded border border-yellow-400/20">
              <div className="text-[10px] font-bold text-yellow-600 mb-0.5">{driver.rating.toFixed(1)}</div>
              <div className="text-[7px] text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="p-1.5 bg-accent/10 rounded border border-accent/20">
          <div className="flex items-center gap-1 mb-0.5">
            <Target size={10} className="text-accent" />
            <span className="font-bold text-[9px]">Tip</span>
          </div>
          <div className="text-[8px] text-muted-foreground">
            {weeklyProgress >= 80 ? (
              <>🎉 Great week! Keep going!</>
            ) : weeklyProgress >= 50 ? (
              <>📈 Good work! Almost there!</>
            ) : (
              <>💪 Drive more for better earnings!</>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}