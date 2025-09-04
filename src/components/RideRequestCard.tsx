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
    <Card className="border mb-1.5 bg-card animate-fade-in-scale">
      <CardHeader className="pb-1.5 bg-primary/10 rounded-t-lg p-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold flex items-center gap-1.5">
            <div className="w-1 h-1 bg-success rounded-full animate-ping" />
            New Ride Request
          </CardTitle>
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-warning/10 rounded-full">
            <Timer size={10} className="text-warning" />
            <span className="text-warning font-bold text-[9px]">{timeLeft}s</span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-1 mt-1" />
      </CardHeader>
      
      <CardContent className="space-y-2 p-2">
        {/* Passenger Info */}
        <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded border">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-[8px]">
              {request.passenger.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-bold text-[10px]">{request.passenger.name}</div>
            <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground">
              <div className="flex items-center gap-0.5">
                <Star size={8} weight="fill" className="text-yellow-500" />
                <span>{request.passenger.rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{request.passenger.tripCount} trips</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-5 w-5 p-0">
            <Phone size={8} />
          </Button>
        </div>

        {/* Trip Route */}
        <div className="space-y-1.5 p-1.5 bg-muted/20 rounded border">
          <div className="flex items-start gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success mt-0.5"></div>
            <div className="flex-1">
              <div className="text-[7px] text-muted-foreground mb-0.5">Pickup</div>
              <div className="font-semibold text-[9px]">{request.pickup.address}</div>
            </div>
          </div>
          
          <div className="ml-0.5 border-l border-dashed border-muted-foreground/40 h-2"></div>
          
          <div className="flex items-start gap-1.5">
            <MapPin size={8} className="text-destructive mt-0.5" weight="fill" />
            <div className="flex-1">
              <div className="text-[7px] text-muted-foreground mb-0.5">Destination</div>
              <div className="font-semibold text-[9px]">{request.destination.address}</div>
            </div>
          </div>
        </div>

        {/* Trip Metrics */}
        <div className="grid grid-cols-3 gap-1">
          <div className="text-center p-1 bg-success/10 rounded border">
            <CurrencyGbp size={10} className="text-success mx-auto mb-0.5" />
            <div className="text-[10px] font-bold text-success">£{request.estimatedFare.toFixed(2)}</div>
            <div className="text-[7px] text-muted-foreground">You earn</div>
          </div>
          <div className="text-center p-1 bg-primary/10 rounded border">
            <Navigation size={10} className="text-primary mx-auto mb-0.5" />
            <div className="text-[10px] font-bold text-primary">{request.estimatedDistance.toFixed(1)}</div>
            <div className="text-[7px] text-muted-foreground">Miles</div>
          </div>
          <div className="text-center p-1 bg-accent/10 rounded border">
            <Clock size={10} className="text-accent mx-auto mb-0.5" />
            <div className="text-[10px] font-bold text-accent">{request.estimatedDuration}</div>
            <div className="text-[7px] text-muted-foreground">Minutes</div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-center justify-between p-1.5 bg-muted/30 rounded">
          <span className="text-[9px] text-muted-foreground">Payment</span>
          <Badge variant="outline" className="text-[7px]">
            {request.paymentMethod === 'cash' ? '💵 Cash' : 
             request.paymentMethod === 'card' ? '💳 Card' : '📱 Digital'}
          </Badge>
        </div>

        {/* Special Requests */}
        {request.specialRequests && (
          <div className="p-1.5 bg-accent/10 rounded border border-accent/20">
            <div className="text-[9px] font-bold text-accent mb-0.5 flex items-center gap-1">
              <Star size={8} weight="fill" />
              Note
            </div>
            <div className="text-[8px]">{request.specialRequests}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <Button 
            variant="outline" 
            onClick={() => onDecline(request.id)}
            className="h-6 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground text-[9px]"
          >
            Decline
          </Button>
          <Button 
            onClick={() => onAccept(request.id)}
            className="h-6 bg-success hover:bg-success/90 text-success-foreground text-[9px]"
          >
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}