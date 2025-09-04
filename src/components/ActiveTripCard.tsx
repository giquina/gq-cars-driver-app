import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActiveTrip } from "@/types";
import { MapPin, Clock, Phone, User, Navigation, CheckCircle } from "@phosphor-icons/react";

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
          color: 'bg-primary'
        };
      case 'arrived_at_pickup':
        return {
          title: 'Arrived at Pickup',
          action: 'Start Trip',
          nextStatus: 'passenger_on_board' as const,
          color: 'bg-warning'
        };
      case 'passenger_on_board':
        return {
          title: 'Trip in Progress',
          action: 'Complete Trip',
          nextStatus: 'completed' as const,
          color: 'bg-accent'
        };
      default:
        return {
          title: 'Trip Status',
          action: 'Continue',
          nextStatus: 'going_to_pickup' as const,
          color: 'bg-muted'
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
    <Card className="border-2 border-accent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{statusInfo.title}</CardTitle>
          <Badge className={`${statusInfo.color} text-white`}>
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Passenger Info */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium">{trip.request.passenger.name}</div>
            <div className="text-sm text-muted-foreground">
              ⭐ {trip.request.passenger.rating.toFixed(1)} • {trip.request.passenger.tripCount} trips
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Phone size={16} />
          </Button>
        </div>

        {/* Trip Route */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full mt-1 ${
              trip.status === 'going_to_pickup' || trip.status === 'arrived_at_pickup' 
                ? 'bg-accent animate-pulse' 
                : 'bg-muted-foreground'
            }`}></div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Pickup</div>
              <div className="font-medium">{trip.request.pickup.address}</div>
            </div>
            {trip.status === 'going_to_pickup' && (
              <Button variant="outline" size="sm">
                <Navigation size={16} />
              </Button>
            )}
          </div>
          
          <div className="ml-1.5 border-l-2 border-dashed border-muted-foreground/30 h-4"></div>
          
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full mt-1 ${
              trip.status === 'passenger_on_board' 
                ? 'bg-accent animate-pulse' 
                : 'bg-muted-foreground'
            }`}></div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Destination</div>
              <div className="font-medium">{trip.request.destination.address}</div>
            </div>
            {trip.status === 'passenger_on_board' && (
              <Button variant="outline" size="sm">
                <Navigation size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-accent">${trip.request.estimatedFare.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Estimated Fare</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{trip.request.estimatedDistance.toFixed(1)} mi</div>
            <div className="text-xs text-muted-foreground">Distance</div>
          </div>
        </div>

        {/* Special Requests */}
        {trip.request.specialRequests && (
          <div className="p-3 bg-accent/10 rounded-lg">
            <div className="text-sm font-medium text-accent mb-1">Special Request</div>
            <div className="text-sm">{trip.request.specialRequests}</div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleStatusUpdate}
          className={`w-full ${statusInfo.color} hover:opacity-90`}
          size="lg"
        >
          {trip.status === 'passenger_on_board' && <CheckCircle size={20} className="mr-2" />}
          {statusInfo.action}
        </Button>
      </CardContent>
    </Card>
  );
}