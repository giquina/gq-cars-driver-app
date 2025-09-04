import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { RideRequest } from "@/types";
import { MapPin, Clock, CurrencyGbp, User, Phone, Star, Navigation, Timer } from "@phosphor-icons/react";
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

  const progressPercentage = (timeLeft / 30) * 100;

  return (
    <Card className="border shadow-md mb-3 bg-gradient-to-br from-card to-primary/5 animate-fade-in-scale">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-ping" />
            New Ride Available
          </CardTitle>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-warning/10 rounded-full border border-warning/20">
            <Timer size={12} className="text-warning" />
            <span className="text-warning font-bold text-xs">{timeLeft}s</span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-1.5 mt-1" />
      </CardHeader>
      
      <CardContent className="space-y-3 p-3">
        {/* Passenger Info */}
        <div className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-muted/30 to-accent/5 rounded-lg border">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-xs">
              {request.passenger.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-bold text-sm">{request.passenger.name}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-0.5">
                <Star size={10} weight="fill" className="text-yellow-500" />
                <span className="font-medium">{request.passenger.rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{request.passenger.tripCount} trips</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 h-6 w-6 p-0">
            <Phone size={10} />
          </Button>
        </div>

        {/* Trip Route */}
        <div className="space-y-2 p-2.5 bg-gradient-to-br from-muted/20 to-muted/10 rounded-lg border">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-success mt-1 shadow-sm"></div>
            <div className="flex-1">
              <div className="text-[8px] text-muted-foreground font-medium mb-0.5">Pick up from</div>
              <div className="font-semibold text-xs">{request.pickup.address}</div>
            </div>
          </div>
          
          <div className="ml-1 border-l border-dashed border-muted-foreground/40 h-3"></div>
          
          <div className="flex items-start gap-2">
            <MapPin size={10} className="text-destructive mt-1" weight="fill" />
            <div className="flex-1">
              <div className="text-[8px] text-muted-foreground font-medium mb-0.5">Drop off at</div>
              <div className="font-semibold text-xs">{request.destination.address}</div>
            </div>
          </div>
        </div>

        {/* Trip Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-gradient-to-br from-success/10 to-success/5 rounded border">
            <CurrencyGbp size={12} className="text-success mx-auto mb-0.5" weight="bold" />
            <div className="text-sm font-bold text-success">£{request.estimatedFare.toFixed(2)}</div>
            <div className="text-[8px] text-muted-foreground font-medium">You'll earn</div>
          </div>
          <div className="text-center p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded border">
            <Navigation size={12} className="text-primary mx-auto mb-0.5" weight="bold" />
            <div className="text-sm font-bold text-primary">{request.estimatedDistance.toFixed(1)}</div>
            <div className="text-[8px] text-muted-foreground font-medium">Miles</div>
          </div>
          <div className="text-center p-2 bg-gradient-to-br from-accent/10 to-accent/5 rounded border">
            <Clock size={12} className="text-accent mx-auto mb-0.5" weight="bold" />
            <div className="text-sm font-bold text-accent">{request.estimatedDuration}</div>
            <div className="text-[8px] text-muted-foreground font-medium">Minutes</div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
          <span className="text-xs font-medium text-muted-foreground">Payment</span>
          <Badge variant="outline" className="font-semibold text-[8px]">
            {request.paymentMethod === 'cash' ? '💵 Cash' : 
             request.paymentMethod === 'card' ? '💳 Card' : '📱 Digital'}
          </Badge>
        </div>

        {/* Special Requests */}
        {request.specialRequests && (
          <div className="p-2 bg-gradient-to-r from-accent/10 to-accent/5 rounded border border-accent/20">
            <div className="text-xs font-bold text-accent mb-1 flex items-center gap-1">
              <Star size={10} weight="fill" />
              Special Note
            </div>
            <div className="text-xs font-medium">{request.specialRequests}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button 
            variant="outline" 
            onClick={() => onDecline(request.id)}
            className="h-8 border border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground font-semibold text-xs transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Decline
          </Button>
          <Button 
            onClick={() => onAccept(request.id)}
            className="h-8 bg-success hover:bg-success/90 text-success-foreground font-semibold text-xs shadow-sm hover:shadow-md transition-all duration-300 border border-success/30"
          >
            Accept Ride
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}