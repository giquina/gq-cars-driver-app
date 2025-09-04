import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RideRequest } from "@/types";
import { MapPin, Clock, DollarSign, User, Phone, Star } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

interface RideRequestCardProps {
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function RideRequestCard({ request, onAccept, onDecline }: RideRequestCardProps) {
  const [timeLeft, setTimeLeft] = useState(30); // 30 second countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onDecline(request.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [request.id, onDecline]);

  return (
    <Card className="border-2 border-primary shadow-lg animate-pulse-once">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">New Ride Request</CardTitle>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-warning" />
            <span className="text-warning font-semibold">{timeLeft}s</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Passenger Info */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium">{request.passenger.name}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star size={12} weight="fill" className="text-accent" />
              {request.passenger.rating.toFixed(1)} • {request.passenger.tripCount} trips
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Phone size={16} className="text-muted-foreground" />
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Pickup</div>
              <div className="font-medium">{request.pickup.address}</div>
            </div>
          </div>
          <div className="ml-1 border-l-2 border-dashed border-muted-foreground/30 h-4"></div>
          <div className="flex items-start gap-3">
            <MapPin size={14} className="text-destructive mt-1" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Destination</div>
              <div className="font-medium">{request.destination.address}</div>
            </div>
          </div>
        </div>

        {/* Fare and Details */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-accent">${request.estimatedFare.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Fare</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{request.estimatedDistance.toFixed(1)} mi</div>
            <div className="text-xs text-muted-foreground">Distance</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{request.estimatedDuration} min</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Payment</span>
          <Badge variant="outline">
            {request.paymentMethod === 'cash' ? 'Cash' : 
             request.paymentMethod === 'card' ? 'Card' : 'Digital Wallet'}
          </Badge>
        </div>

        {/* Special Requests */}
        {request.specialRequests && (
          <div className="p-3 bg-accent/10 rounded-lg">
            <div className="text-sm font-medium text-accent mb-1">Special Request</div>
            <div className="text-sm">{request.specialRequests}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={() => onDecline(request.id)}
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Decline
          </Button>
          <Button 
            onClick={() => onAccept(request.id)}
            className="bg-accent hover:bg-accent/90"
          >
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}