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
          action: 'Arrived at Pickup',
          nextStatus: 'arrived_at_pickup' as const,
          color: 'bg-primary',
          bgClass: 'from-primary/10 to-primary/5'
        };
      case 'arrived_at_pickup':
        return {
          title: 'Arrived at Pickup',
          action: 'Start Trip',
          nextStatus: 'passenger_on_board' as const,
          color: 'bg-warning',
          bgClass: 'from-warning/10 to-warning/5'
        };
      case 'passenger_on_board':
        return {
          title: 'Trip in Progress',
          action: 'Complete Trip',
          nextStatus: 'completed' as const,
          color: 'bg-success',
          bgClass: 'from-success/10 to-success/5'
        };
      default:
        return {
          title: 'Trip Status',
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
    <Card className="border shadow-lg bg-gradient-to-br from-card to-accent/5 mb-6">
      <CardHeader className={`pb-4 bg-gradient-to-r ${statusInfo.bgClass} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <CarProfile size={20} className="text-accent" weight="bold" />
            {statusInfo.title}
          </CardTitle>
          <Badge className={`${statusInfo.color} text-white px-3 py-1 text-sm font-semibold rounded-full shadow-md`}>
            ACTIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Passenger Info */}
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border">
            <User size={20} className="text-primary" weight="bold" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-base">{trip.request.passenger.name}</div>
            <div className="text-sm text-muted-foreground font-medium">
              ⭐ {trip.request.passenger.rating.toFixed(1)} • {trip.request.passenger.tripCount} trips
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-10 w-10 rounded-lg">
            <Phone size={16} weight="bold" />
          </Button>
        </div>

        {/* Trip Route */}
        <div className="space-y-4 p-4 bg-muted/20 rounded-xl border">
          <div className="flex items-start gap-4">
            <div className={`w-3 h-3 rounded-full mt-2 ${
              trip.status === 'going_to_pickup' || trip.status === 'arrived_at_pickup' 
                ? 'bg-success animate-pulse' 
                : 'bg-muted-foreground'
            }`}></div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground font-medium mb-1">Pickup Location</div>
              <div className="font-semibold text-base">{trip.request.pickup.address}</div>
            </div>
            {trip.status === 'going_to_pickup' && (
              <Button variant="outline" size="sm" className="h-8 w-8 rounded-lg">
                <Navigation size={14} weight="bold" />
              </Button>
            )}
          </div>
          
          <div className="ml-1.5 border-l-2 border-dashed border-muted-foreground/40 h-6"></div>
          
          <div className="flex items-start gap-4">
            <MapPin size={16} className={`mt-1 ${
              trip.status === 'passenger_on_board' 
                ? 'text-destructive animate-pulse' 
                : 'text-muted-foreground'
            }`} weight="fill" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground font-medium mb-1">Destination</div>
              <div className="font-semibold text-base">{trip.request.destination.address}</div>
            </div>
            {trip.status === 'passenger_on_board' && (
              <Button variant="outline" size="sm" className="h-8 w-8 rounded-lg">
                <Navigation size={14} weight="bold" />
              </Button>
            )}
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-success/10 rounded-xl border border-success/20">
            <div className="text-xl font-bold text-success">£{trip.request.estimatedFare.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground font-medium">Estimated Fare</div>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded-xl border border-primary/20">
            <div className="text-xl font-bold text-primary">{trip.request.estimatedDistance.toFixed(1)} mi</div>
            <div className="text-xs text-muted-foreground font-medium">Distance</div>
          </div>
        </div>

        {/* Special Requests */}
        {trip.request.specialRequests && (
          <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
            <div className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
              <Clock size={14} weight="bold" />
              Special Request
            </div>
            <div className="text-sm font-medium">{trip.request.specialRequests}</div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleStatusUpdate}
          className={`w-full h-14 text-lg font-bold rounded-xl transition-all duration-300 shadow-lg ${
            trip.status === 'passenger_on_board' 
              ? 'bg-success hover:bg-success/90 text-success-foreground' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          } border-2 border-opacity-30`}
          size="lg"
        >
          <div className="flex items-center justify-center gap-2">
            {trip.status === 'passenger_on_board' && <CheckCircle size={20} weight="bold" />}
            {statusInfo.action}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}