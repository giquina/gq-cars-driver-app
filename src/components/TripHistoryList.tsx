import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TripHistory } from "@/types";
import { MapPin, Clock, DollarSign, Star, User, Heart } from "@phosphor-icons/react";

interface TripHistoryListProps {
  trips: TripHistory[];
}

export function TripHistoryList({ trips }: TripHistoryListProps) {
  if (trips.length === 0) {
    return (
      <Card className="animate-fade-in-scale">
        <CardContent className="text-center py-12">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No trips yet</h3>
          <p className="text-muted-foreground text-sm">Your completed trips will appear here</p>
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock size={20} />
          Recent Trips ({trips.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {trips.map((trip, index) => (
          <div 
            key={trip.id} 
            className="border rounded-xl p-4 space-y-4 bg-gradient-to-r from-card to-muted/20 hover:shadow-md transition-all duration-200 animate-slide-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-semibold">
                    {trip.passenger.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{trip.passenger.name}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(trip.completedAt)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-success">${trip.fare.toFixed(2)}</div>
                {trip.tip && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                    <Heart size={12} className="text-red-500" weight="fill" />
                    +${trip.tip.toFixed(2)} tip
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-success mt-1.5 shadow-sm"></div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground font-medium mb-1">From</div>
                  <span className="text-sm font-medium">{trip.pickup}</span>
                </div>
              </div>
              <div className="ml-1.5 border-l-2 border-dashed border-muted-foreground/30 h-3"></div>
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-destructive mt-1" weight="fill" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground font-medium mb-1">To</div>
                  <span className="text-sm font-medium">{trip.destination}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-muted">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {trip.duration}m
                </span>
                <span>{trip.distance.toFixed(1)} mi</span>
              </div>
              
              <div className="flex items-center gap-2">
                {trip.passengerRating && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <User size={12} />
                    <Star size={12} weight="fill" className="text-yellow-500" />
                    {trip.passengerRating}
                  </Badge>
                )}
                {trip.rating && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star size={12} weight="fill" className="text-yellow-500" />
                    {trip.rating.toFixed(1)}
                  </Badge>
                )}
              </div>
            </div>

            {trip.passengerFeedback && (
              <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-accent">
                <div className="text-xs text-accent font-semibold mb-1">Your rating feedback:</div>
                <div className="text-sm italic">"{trip.passengerFeedback}"</div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}