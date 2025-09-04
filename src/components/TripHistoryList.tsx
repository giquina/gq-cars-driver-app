import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TripHistory } from "@/types";
import { MapPin, Clock, CurrencyGbp, Star, User, Heart } from "@phosphor-icons/react";

interface TripHistoryListProps {
  trips: TripHistory[];
}

export function TripHistoryList({ trips }: TripHistoryListProps) {
  if (trips.length === 0) {
    return (
      <Card className="animate-fade-in-scale">
        <CardContent className="text-center py-8">
          <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock size={20} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-sm mb-1">No trips yet</h3>
          <p className="text-muted-foreground text-xs">Your rides will appear here</p>
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
      <CardHeader className="p-2">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <Clock size={14} />
          Recent Trips ({trips.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar p-2">
        {trips.map((trip, index) => (
          <div 
            key={trip.id} 
            className="border rounded-lg p-2.5 space-y-2 bg-gradient-to-r from-card to-muted/20 hover:shadow-md transition-all duration-200 animate-slide-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-semibold">
                    {trip.passenger.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-xs">{trip.passenger.name}</div>
                  <div className="text-[8px] text-muted-foreground">{formatDate(trip.completedAt)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-success">£{trip.fare.toFixed(2)}</div>
                {trip.tip && (
                  <div className="text-[8px] text-muted-foreground flex items-center gap-0.5 justify-end">
                    <Heart size={8} className="text-red-500" weight="fill" />
                    +£{trip.tip.toFixed(2)} tip
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-success mt-1 shadow-sm"></div>
                <div className="flex-1">
                  <div className="text-[8px] text-muted-foreground font-medium mb-0.5">From</div>
                  <span className="text-xs font-medium">{trip.pickup}</span>
                </div>
              </div>
              <div className="ml-1 border-l border-dashed border-muted-foreground/30 h-2"></div>
              <div className="flex items-start gap-2">
                <MapPin size={8} className="text-destructive mt-1" weight="fill" />
                <div className="flex-1">
                  <div className="text-[8px] text-muted-foreground font-medium mb-0.5">To</div>
                  <span className="text-xs font-medium">{trip.destination}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-1.5 border-t border-muted">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Clock size={10} />
                  {trip.duration}m
                </span>
                <span>{trip.distance.toFixed(1)} mi</span>
              </div>
              
              <div className="flex items-center gap-1">
                {trip.passengerRating && (
                  <Badge variant="outline" className="flex items-center gap-0.5 px-1 py-0.5 text-[8px]">
                    <User size={8} />
                    <Star size={8} weight="fill" className="text-yellow-500" />
                    {trip.passengerRating}
                  </Badge>
                )}
                {trip.rating && (
                  <Badge variant="secondary" className="flex items-center gap-0.5 px-1 py-0.5 text-[8px]">
                    <Star size={8} weight="fill" className="text-yellow-500" />
                    {trip.rating.toFixed(1)}
                  </Badge>
                )}
              </div>
            </div>

            {trip.passengerFeedback && (
              <div className="p-2 bg-muted/50 rounded border-l-2 border-accent">
                <div className="text-[8px] text-accent font-semibold mb-1">Your feedback:</div>
                <div className="text-[10px] italic">"{trip.passengerFeedback}"</div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}