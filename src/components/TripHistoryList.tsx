import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TripHistory } from "@/types/index";
import { MapPin, Clock, CurrencyGbp, Star, User, Heart } from "@phosphor-icons/react";

interface TripHistoryListProps {
  trips: TripHistory[];
}

export function TripHistoryList({ trips }: TripHistoryListProps) {
  if (trips.length === 0) {
    return (
      <Card className="animate-fade-in-scale">
        <CardContent className="text-center py-4">
          <div className="w-8 h-8 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock size={16} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-xs mb-1">No trips yet</h3>
          <p className="text-muted-foreground text-[9px]">Your rides will appear here</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="animate-fade-in-scale">
      <CardHeader className="p-1.5">
        <CardTitle className="flex items-center gap-1 text-xs">
          <Clock size={12} />
          Recent Trips ({trips.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar p-1.5">
        {trips.map((trip, index) => (
          <div 
            key={trip.id} 
            className="border rounded-lg p-1.5 bg-card hover:shadow-md transition-all animate-slide-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-[7px] font-semibold">
                    {trip.passenger.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-[9px]">{trip.passenger.name}</div>
                  <div className="text-[7px] text-muted-foreground">{formatDate(trip.completedAt)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  <CurrencyGbp size={8} className="text-success" />
                  <span className="font-bold text-[9px] text-success">{trip.fare.toFixed(2)}</span>
                  {trip.tip && (
                    <>
                      <span className="text-[8px] text-muted-foreground">+</span>
                      <span className="text-[8px] text-success">{trip.tip.toFixed(2)}</span>
                    </>
                  )}
                </div>
                {trip.rating && (
                  <div className="flex items-center gap-0.5">
                    <Star size={6} weight="fill" className="text-yellow-500" />
                    <span className="text-[7px] text-yellow-600">{trip.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Simplified route display */}
            <div className="text-[8px] text-muted-foreground">
              <span className="font-medium">{trip.pickup}</span>
              <span className="mx-1">→</span>
              <span className="font-medium">{trip.destination}</span>
            </div>
            
            <div className="flex items-center justify-between text-[7px] text-muted-foreground mt-1">
              <span>{trip.duration}m • {trip.distance.toFixed(1)} mi</span>
              {trip.passengerRating && (
                <div className="flex items-center gap-0.5">
                  <User size={6} />
                  <span>rated you {trip.passengerRating}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}