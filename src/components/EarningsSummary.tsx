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
        {/* Today's Earnings Highlight - simplified */}
        <div className="p-2 bg-success/10 rounded border border-success/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-gradient-to-br from-success to-accent rounded">
                <Clock size={12} className="text-white" />
              </div>
              <div className="flex items-center gap-1">
                <CurrencyGbp size={14} className="text-success" />
                <span className="text-lg font-bold text-success">{driver.earnings.today.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">today</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/50 rounded p-1.5 border border-white/60">
              <span className="text-sm font-bold text-foreground">{driver.trips.completed}</span>
              <span className="text-xs text-muted-foreground">trips</span>
            </div>
          </div>
          
          {avgPerTrip > 0 && (
            <div className="flex items-center justify-between text-[9px] bg-white/30 rounded p-1 mt-1">
              <span className="text-muted-foreground">Per trip</span>
              <span className="font-bold text-success flex items-center gap-0.5">
                <CurrencyGbp size={8} />
                {avgPerTrip.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        
        {/* Weekly & Monthly Progress - more compact */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="p-1.5 bg-primary/10 rounded border border-primary/20">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Calendar size={8} className="text-primary" />
                <span className="font-bold text-[8px]">Week</span>
              </div>
              <div className="flex items-center gap-0.5">
                <CurrencyGbp size={8} className="text-primary" />
                <span className="text-[9px] font-bold text-primary">{driver.earnings.thisWeek.toFixed(0)}</span>
              </div>
            </div>
            <Progress value={weeklyProgress} className="h-1 bg-muted/50" />
            <div className="text-[7px] text-muted-foreground mt-0.5 text-center">
              {weeklyProgress.toFixed(0)}% of £{weeklyGoal}
            </div>
          </div>
          
          <div className="p-1.5 bg-accent/10 rounded border border-accent/20">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Trophy size={8} className="text-accent" />
                <span className="font-bold text-[8px]">Month</span>
              </div>
              <div className="flex items-center gap-0.5">
                <CurrencyGbp size={8} className="text-accent" />
                <span className="text-[9px] font-bold text-accent">{driver.earnings.thisMonth.toFixed(0)}</span>
              </div>
            </div>
            <Progress value={monthlyProgress} className="h-1 bg-muted/50" />
            <div className="text-[7px] text-muted-foreground mt-0.5 text-center">
              {monthlyProgress.toFixed(0)}% of £{monthlyGoal}
            </div>
          </div>
        </div>

        {/* Trip Statistics - simplified to one line */}
        <div className="pt-1.5 border-t border-muted/50">
          <h4 className="font-bold text-[9px] mb-1 flex items-center gap-1">
            <TrendingUp size={10} />
            Your Stats
          </h4>
          <div className="grid grid-cols-3 gap-1">
            <div className="flex items-center justify-center p-1.5 bg-success/10 rounded border border-success/20">
              <span className="text-[9px] font-bold text-success">{driver.trips.completed}</span>
              <span className="text-[8px] text-muted-foreground ml-1">done</span>
            </div>
            <div className="flex items-center justify-center p-1.5 bg-destructive/10 rounded border border-destructive/20">
              <span className="text-[9px] font-bold text-destructive">{driver.trips.cancelled}</span>
              <span className="text-[8px] text-muted-foreground ml-1">missed</span>
            </div>
            <div className="flex items-center justify-center p-1.5 bg-yellow-500/10 rounded border border-yellow-400/20">
              <span className="text-[9px] font-bold text-yellow-600">{driver.rating.toFixed(1)}</span>
              <span className="text-[8px] text-muted-foreground ml-1">rating</span>
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