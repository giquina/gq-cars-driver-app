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
            className="border rounded-lg p-1.5 space-y-1.5 bg-card hover:shadow-md transition-all animate-slide-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-[8px] font-semibold">
                    {trip.passenger.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-[9px]">{trip.passenger.name}</div>
                  <div className="text-[7px] text-muted-foreground">{formatDate(trip.completedAt)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[10px] text-success">£{trip.fare.toFixed(2)}</div>
                {trip.tip && (
                  <div className="text-[7px] text-muted-foreground flex items-center gap-0.5 justify-end">
                    <Heart size={6} className="text-red-500" weight="fill" />
                    +£{trip.tip.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-start gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success mt-0.5"></div>
                <div className="flex-1">
                  <div className="text-[7px] text-muted-foreground mb-0.5">From</div>
                  <span className="text-[9px] font-medium">{trip.pickup}</span>
                </div>
              </div>
              <div className="ml-0.5 border-l border-dashed border-muted-foreground/30 h-1.5"></div>
              <div className="flex items-start gap-1.5">
                <MapPin size={6} className="text-destructive mt-0.5" weight="fill" />
                <div className="flex-1">
                  <div className="text-[7px] text-muted-foreground mb-0.5">To</div>
                  <span className="text-[9px] font-medium">{trip.destination}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-1 border-t border-muted">
              <div className="flex items-center gap-2 text-[8px] text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Clock size={8} />
                  {trip.duration}m
                </span>
                <span>{trip.distance.toFixed(1)} mi</span>
              </div>
              
              <div className="flex items-center gap-1">
                {trip.passengerRating && (
                  <Badge variant="outline" className="flex items-center gap-0.5 px-1 py-0.5 text-[7px]">
                    <User size={6} />
                    <Star size={6} weight="fill" className="text-yellow-500" />
                    {trip.passengerRating}
                  </Badge>
                )}
                {trip.rating && (
                  <Badge variant="secondary" className="flex items-center gap-0.5 px-1 py-0.5 text-[7px]">
                    <Star size={6} weight="fill" className="text-yellow-500" />
                    {trip.rating.toFixed(1)}
                  </Badge>
                )}
              </div>
            </div>

            {trip.passengerFeedback && (
              <div className="p-1.5 bg-muted/50 rounded border-l-2 border-accent">
                <div className="text-[7px] text-accent font-semibold mb-0.5">Your feedback:</div>
                <div className="text-[8px] italic">"{trip.passengerFeedback}"</div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}