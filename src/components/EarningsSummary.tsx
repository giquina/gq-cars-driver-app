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
    <Card className="animate-fade-in-scale overflow-hidden border-2 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-success/10 via-accent/5 to-primary/10 border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-success via-accent to-primary rounded-xl shadow-lg">
              <CurrencyGbp size={24} className="text-white" weight="bold" />
            </div>
            <span className="text-xl font-bold">Earnings Summary</span>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border-yellow-400/30">
            <Star size={14} weight="fill" className="text-yellow-600" />
            <span className="font-bold text-yellow-700">{driver.rating.toFixed(1)}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Today's Earnings Highlight */}
        <div className="p-8 bg-gradient-to-br from-success/15 via-success/10 to-accent/15 rounded-2xl border-2 border-success/25 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-success via-accent to-success rounded-2xl shadow-2xl">
                <Clock size={28} className="text-white" weight="bold" />
              </div>
              <div>
                <div className="text-base text-muted-foreground font-semibold mb-1">Today's Earnings</div>
                <div className="text-4xl font-black text-success flex items-center gap-1">
                  <CurrencyGbp size={32} weight="bold" />
                  {driver.earnings.today.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="text-right bg-white/50 rounded-2xl p-4 border border-white/60">
              <div className="text-2xl font-black text-foreground">{driver.trips.completed}</div>
              <div className="text-sm text-muted-foreground font-semibold">trips completed</div>
            </div>
          </div>
          
          {avgPerTrip > 0 && (
            <div className="flex items-center justify-between text-base bg-white/30 rounded-xl p-3">
              <span className="text-muted-foreground font-semibold">Average per trip</span>
              <span className="font-black text-success flex items-center gap-1">
                <CurrencyGbp size={16} weight="bold" />
                {avgPerTrip.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        
        {/* Weekly & Monthly Progress */}
        <div className="grid grid-cols-1 gap-6">
          <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-muted/10 rounded-2xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-primary" weight="bold" />
                <span className="font-bold text-lg">This Week</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-primary flex items-center gap-1">
                  <CurrencyGbp size={20} weight="bold" />
                  {driver.earnings.thisWeek.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground font-semibold">of £{weeklyGoal} goal</div>
              </div>
            </div>
            <Progress value={weeklyProgress} className="h-4 bg-muted/50" />
            <div className="text-sm text-muted-foreground mt-2 text-center font-semibold">
              {weeklyProgress.toFixed(0)}% completed
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-accent/10 via-accent/5 to-muted/10 rounded-2xl border-2 border-accent/20 hover:border-accent/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy size={20} className="text-accent" weight="bold" />
                <span className="font-bold text-lg">This Month</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-accent flex items-center gap-1">
                  <CurrencyGbp size={20} weight="bold" />
                  {driver.earnings.thisMonth.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground font-semibold">of £{monthlyGoal} goal</div>
              </div>
            </div>
            <Progress value={monthlyProgress} className="h-4 bg-muted/50" />
            <div className="text-sm text-muted-foreground mt-2 text-center font-semibold">
              {monthlyProgress.toFixed(0)}% completed
            </div>
          </div>
        </div>

        {/* Trip Statistics */}
        <div className="pt-6 border-t-2 border-muted/50">
          <h4 className="font-bold text-lg mb-6 flex items-center gap-3">
            <TrendingUp size={20} weight="bold" />
            Trip Statistics
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-5 bg-gradient-to-br from-success/15 to-success/5 rounded-2xl border-2 border-success/20 hover:border-success/40 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-black text-success mb-2">{driver.trips.completed}</div>
              <div className="text-sm text-muted-foreground font-semibold">Completed</div>
            </div>
            <div className="text-center p-5 bg-gradient-to-br from-destructive/15 to-destructive/5 rounded-2xl border-2 border-destructive/20 hover:border-destructive/40 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-black text-destructive mb-2">{driver.trips.cancelled}</div>
              <div className="text-sm text-muted-foreground font-semibold">Cancelled</div>
            </div>
            <div className="text-center p-5 bg-gradient-to-br from-yellow-500/15 to-yellow-300/5 rounded-2xl border-2 border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-black text-yellow-600 mb-2">{driver.rating.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground font-semibold">Rating</div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="p-6 bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 rounded-2xl border-2 border-accent/25 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Target size={20} className="text-accent" weight="bold" />
            <span className="font-bold text-lg">Performance Insights</span>
          </div>
          <div className="text-base text-muted-foreground font-medium">
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