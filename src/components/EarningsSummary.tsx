import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Driver } from "@/types/index";
import { CurrencyGbp, TrendingUp, Clock, Calendar, Target, Star, Trophy, CaretLeft, CaretRight } from "@phosphor-icons/react";

interface EarningsSummaryProps {
  driver: Driver;
}

export function EarningsSummary({ driver }: EarningsSummaryProps) {
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = current week, -1 = previous week, etc.
  
  // Get current date and week
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
  
  const weekStart = new Date(currentWeekStart);
  weekStart.setDate(currentWeekStart.getDate() + (currentWeek * 7));
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const formatDateRange = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit' };
    return `${start.toLocaleDateString('en-GB', options)} - ${end.toLocaleDateString('en-GB', options)}`;
  };
  
  // Generate week days for calendar view
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekNumbers = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day.getDate();
  });

  const weeklyGoal = 400; // £400 weekly goal
  const monthlyGoal = 1600; // £1600 monthly goal
  const weeklyProgress = Math.min((driver.earnings.thisWeek / weeklyGoal) * 100, 100);
  const monthlyProgress = Math.min((driver.earnings.thisMonth / monthlyGoal) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentWeek(currentWeek - 1)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <CaretLeft size={16} />
        </button>
        
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
          <Calendar size={16} className="text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-sm">{formatDateRange(weekStart, weekEnd)}</span>
        </div>
        
        <button
          onClick={() => setCurrentWeek(currentWeek + 1)}
          disabled={currentWeek >= 0}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-800"
        >
          <CaretRight size={16} />
        </button>
      </div>

      {/* Large Earnings Display */}
      <div className="text-center py-8">
        <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
          {currentWeek === 0 ? driver.earnings.thisWeek.toFixed(2) : '0.00'}
        </div>
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Total earnings this week
        </div>
      </div>

      {/* Weekly Calendar View */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDays.map((day, index) => (
          <div key={day} className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{day}</div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentWeek === 0 && index < today.getDay() 
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
              {weekNumbers[index]}
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <Button 
        variant="outline" 
        className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        View breakdown
      </Button>

      {/* Status Message for No Trips */}
      {currentWeek === 0 && driver.trips.completed === 0 && (
        <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl mb-2">🚗</div>
          <div className="font-semibold text-gray-900 dark:text-white mb-1">
            No trips completed yet
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Go online to start earning
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {currentWeek === 0 && driver.trips.completed > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-lg p-3 border text-center">
            <div className="text-lg font-bold text-foreground">{driver.trips.completed}</div>
            <div className="text-xs text-muted-foreground">Total trips</div>
          </div>
          <div className="bg-card rounded-lg p-3 border text-center">
            <div className="text-lg font-bold text-yellow-600">{driver.rating.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
        </div>
      )}
    </div>
  );
}