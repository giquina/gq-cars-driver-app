import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActiveTrip } from "@/types";
import { MapPin, Clock, Phone, User, Navigation, CheckCircle, CarProfile } from "@phosphor-icons/react";

interface ActiveTripCardProps {
  trip: ActiveTrip;
  onUpdateStatus: (tripId: string, status: ActiveTrip['status']) => void;
  onCompleteTrip: (tripId: string) => void;
}

export function ActiveTripCard({ trip, onUpdateStatus, onCompleteTrip }: ActiveTripCardProps) {
  const getStatusInfo = () => {
    switch (trip.status) {
      case 'going_to_pickup':
        return {
          title: 'Going to Pickup',
          action: 'I\'m Here',
          nextStatus: 'arrived_at_pickup' as const,
          color: 'bg-primary',
          bgClass: 'from-primary/10 to-primary/5'
        };
      case 'arrived_at_pickup':
        return {
          title: 'At Pickup',
          action: 'Start Trip',
          nextStatus: 'passenger_on_board' as const,
          color: 'bg-warning',
          bgClass: 'from-warning/10 to-warning/5'
        };
      case 'passenger_on_board':
        return {
          title: 'Trip Started',
          action: 'End Trip',
          nextStatus: 'completed' as const,
          color: 'bg-success',
          bgClass: 'from-success/10 to-success/5'
        };
      default:
        return {
          title: 'Active Trip',
          action: 'Continue',
          nextStatus: 'going_to_pickup' as const,
          color: 'bg-muted',
          bgClass: 'from-muted/10 to-muted/5'
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleStatusUpdate = () => {
    if (statusInfo.nextStatus === 'completed') {
      onCompleteTrip(trip.id);
    } else {
      onUpdateStatus(trip.id, statusInfo.nextStatus);
    }
  };

  return (
    <Card className="border mb-1.5 bg-card">
      <CardHeader className={`pb-1.5 bg-gradient-to-r ${statusInfo.bgClass} rounded-t-lg p-2`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold flex items-center gap-1.5">
            <CarProfile size={12} className="text-accent" />
            {statusInfo.title}
          </CardTitle>
          <Badge className={`${statusInfo.color} text-white px-1.5 py-0.5 text-[8px] font-semibold rounded-full`}>
            ACTIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-2">
        {/* Passenger Info */}
        <div className="flex items-center gap-1.5 p-1.5 bg-muted/30 rounded border">
          <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center border">
            <User size={10} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[9px]">{trip.request.passenger.name}</div>
            <div className="text-[8px] text-muted-foreground">
              ⭐ {trip.request.passenger.rating.toFixed(1)} • {trip.request.passenger.tripCount} trips
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-6 w-6 rounded">
            <Phone size={10} />
          </Button>
        </div>

        {/* Trip Route */}
        <div className="space-y-1.5 p-1.5 bg-muted/20 rounded border">
          <div className="flex items-start gap-2">
            <div className={`w-2 h-2 rounded-full mt-1 ${
              trip.status === 'going_to_pickup' || trip.status === 'arrived_at_pickup' 
                ? 'bg-success animate-pulse' 
                : 'bg-muted-foreground'
            }`}></div>
            <div className="flex-1">
              <div className="text-[7px] text-muted-foreground mb-0.5">Pickup</div>
              <div className="font-semibold text-[9px]">{trip.request.pickup.address}</div>
            </div>
            {trip.status === 'going_to_pickup' && (
              <Button variant="outline" size="sm" className="h-5 w-5 rounded">
                <Navigation size={8} />
              </Button>
            )}
          </div>
          
          <div className="ml-1 border-l border-dashed border-muted-foreground/40 h-2"></div>
          
          <div className="flex items-start gap-2">
            <MapPin size={8} className={`mt-1 ${
              trip.status === 'passenger_on_board' 
                ? 'text-destructive animate-pulse' 
                : 'text-muted-foreground'
            }`} weight="fill" />
            <div className="flex-1">
              <div className="text-[7px] text-muted-foreground mb-0.5">Destination</div>
              <div className="font-semibold text-[9px]">{trip.request.destination.address}</div>
            </div>
            {trip.status === 'passenger_on_board' && (
              <Button variant="outline" size="sm" className="h-5 w-5 rounded">
                <Navigation size={8} />
              </Button>
            )}
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="text-center p-1.5 bg-success/10 rounded border border-success/20">
            <div className="text-[10px] font-bold text-success">£{trip.request.estimatedFare.toFixed(2)}</div>
            <div className="text-[7px] text-muted-foreground">You earn</div>
          </div>
          <div className="text-center p-1.5 bg-primary/10 rounded border border-primary/20">
            <div className="text-[10px] font-bold text-primary">{trip.request.estimatedDistance.toFixed(1)} mi</div>
            <div className="text-[7px] text-muted-foreground">Distance</div>
          </div>
        </div>

        {/* Special Requests */}
        {trip.request.specialRequests && (
          <div className="p-1.5 bg-accent/10 rounded border border-accent/20">
            <div className="text-[9px] font-semibold text-accent mb-0.5 flex items-center gap-1">
              <Clock size={8} />
              Note
            </div>
            <div className="text-[8px]">{trip.request.specialRequests}</div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleStatusUpdate}
          className={`w-full h-7 text-[9px] font-bold rounded transition-all ${
            trip.status === 'passenger_on_board' 
              ? 'bg-success hover:bg-success/90 text-success-foreground' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
          size="sm"
        >
          <div className="flex items-center justify-center gap-1.5">
            {trip.status === 'passenger_on_board' && <CheckCircle size={10} />}
            {statusInfo.action}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}