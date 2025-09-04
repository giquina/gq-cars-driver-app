import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TripHistory } from "@/types";
import { MapPin, Clock, DollarSign, Star } from "@phosphor-icons/react";

interface TripHistoryListProps {
  trips: TripHistory[];
}

export function TripHistoryList({ trips }: TripHistoryListProps) {
  if (trips.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Clock size={48} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No trip history yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Trips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trips.map((trip) => (
          <div key={trip.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{trip.passenger.name}</div>
              <div className="text-right">
                <div className="font-bold text-accent">${trip.fare.toFixed(2)}</div>
                {trip.tip && <div className="text-sm text-muted-foreground">+${trip.tip.toFixed(2)} tip</div>}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5"></div>
                <span className="text-muted-foreground flex-1">{trip.pickup}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={12} className="text-destructive mt-1" />
                <span className="text-muted-foreground flex-1">{trip.destination}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{new Date(trip.completedAt).toLocaleDateString()}</span>
              <div className="flex items-center gap-3">
                <span>{trip.distance.toFixed(1)} mi</span>
                <span>{trip.duration} min</span>
                {trip.rating && (
                  <div className="flex items-center gap-1">
                    <Star size={12} weight="fill" className="text-accent" />
                    <span>{trip.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}