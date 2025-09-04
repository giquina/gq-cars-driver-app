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
          title: 'Going to Pick Up',
          action: 'I\'ve Arrived',
          nextStatus: 'arrived_at_pickup' as const,
          color: 'bg-primary',
          bgClass: 'from-primary/10 to-primary/5'
        };
      case 'arrived_at_pickup':
        return {
          title: 'At Pickup Location',
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
    <Card className="border shadow-md bg-gradient-to-br from-card to-accent/5 mb-3">
      <CardHeader className={`pb-2 bg-gradient-to-r ${statusInfo.bgClass} rounded-t-lg p-3`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <CarProfile size={16} className="text-accent" weight="bold" />
            {statusInfo.title}
          </CardTitle>
          <Badge className={`${statusInfo.color} text-white px-2 py-0.5 text-xs font-semibold rounded-full shadow-sm`}>
            ACTIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        {/* Passenger Info */}
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center border">
            <User size={14} className="text-primary" weight="bold" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">{trip.request.passenger.name}</div>
            <div className="text-xs text-muted-foreground font-medium">
              ⭐ {trip.request.passenger.rating.toFixed(1)} • {trip.request.passenger.tripCount} trips
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8 w-8 rounded-lg">
            <Phone size={12} weight="bold" />
          </Button>
        </div>

        {/* Trip Route */}
        <div className="space-y-2 p-3 bg-muted/20 rounded-lg border">
          <div className="flex items-start gap-3">
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
              trip.status === 'going_to_pickup' || trip.status === 'arrived_at_pickup' 
                ? 'bg-success animate-pulse' 
                : 'bg-muted-foreground'
            }`}></div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground font-medium mb-0.5">Pick up from</div>
              <div className="font-semibold text-xs">{trip.request.pickup.address}</div>
            </div>
            {trip.status === 'going_to_pickup' && (
              <Button variant="outline" size="sm" className="h-6 w-6 rounded">
                <Navigation size={10} weight="bold" />
              </Button>
            )}
          </div>
          
          <div className="ml-1.5 border-l border-dashed border-muted-foreground/40 h-3"></div>
          
          <div className="flex items-start gap-3">
            <MapPin size={12} className={`mt-1 ${
              trip.status === 'passenger_on_board' 
                ? 'text-destructive animate-pulse' 
                : 'text-muted-foreground'
            }`} weight="fill" />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground font-medium mb-0.5">Drop off at</div>
              <div className="font-semibold text-xs">{trip.request.destination.address}</div>
            </div>
            {trip.status === 'passenger_on_board' && (
              <Button variant="outline" size="sm" className="h-6 w-6 rounded">
                <Navigation size={10} weight="bold" />
              </Button>
            )}
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2.5 bg-success/10 rounded-lg border border-success/20">
            <div className="text-sm font-bold text-success">£{trip.request.estimatedFare.toFixed(2)}</div>
            <div className="text-[8px] text-muted-foreground font-medium">You'll earn</div>
          </div>
          <div className="text-center p-2.5 bg-primary/10 rounded-lg border border-primary/20">
            <div className="text-sm font-bold text-primary">{trip.request.estimatedDistance.toFixed(1)} mi</div>
            <div className="text-[8px] text-muted-foreground font-medium">Distance</div>
          </div>
        </div>

        {/* Special Requests */}
        {trip.request.specialRequests && (
          <div className="p-2.5 bg-accent/10 rounded-lg border border-accent/20">
            <div className="text-xs font-semibold text-accent mb-1 flex items-center gap-1">
              <Clock size={10} weight="bold" />
              Special Note
            </div>
            <div className="text-xs font-medium">{trip.request.specialRequests}</div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleStatusUpdate}
          className={`w-full h-10 text-sm font-bold rounded-lg transition-all duration-300 shadow-md ${
            trip.status === 'passenger_on_board' 
              ? 'bg-success hover:bg-success/90 text-success-foreground' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          } border border-opacity-30`}
          size="sm"
        >
          <div className="flex items-center justify-center gap-2">
            {trip.status === 'passenger_on_board' && <CheckCircle size={14} weight="bold" />}
            {statusInfo.action}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}