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
    <Card className="border-2 border-primary shadow-2xl animate-pulse-once mb-6 bg-gradient-to-br from-card via-card/95 to-primary/5">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            New Ride Request
          </CardTitle>
          <div className="flex items-center gap-2 px-3 py-1 bg-warning/10 rounded-full border border-warning/20">
            <Timer size={16} className="text-warning" />
            <span className="text-warning font-bold text-lg">{timeLeft}s</span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2 mt-2" />
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* Passenger Info */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted/30 to-accent/5 rounded-xl border">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg">
              {request.passenger.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-bold text-lg">{request.passenger.name}</div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star size={14} weight="fill" className="text-yellow-500" />
                <span className="font-medium">{request.passenger.rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{request.passenger.tripCount} trips</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            <Phone size={16} />
          </Button>
        </div>

        {/* Trip Route */}
        <div className="space-y-4 p-4 bg-gradient-to-br from-muted/20 to-muted/10 rounded-xl border">
          <div className="flex items-start gap-4">
            <div className="w-3 h-3 rounded-full bg-success mt-2 shadow-lg"></div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground font-medium mb-1">Pickup Location</div>
              <div className="font-semibold text-base">{request.pickup.address}</div>
            </div>
          </div>
          
          <div className="ml-1.5 border-l-2 border-dashed border-muted-foreground/40 h-6"></div>
          
          <div className="flex items-start gap-4">
            <MapPin size={16} className="text-destructive mt-1" weight="fill" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground font-medium mb-1">Destination</div>
              <div className="font-semibold text-base">{request.destination.address}</div>
            </div>
          </div>
        </div>

        {/* Trip Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border">
            <CurrencyGbp size={20} className="text-success mx-auto mb-2" weight="bold" />
            <div className="text-xl font-bold text-success">£{request.estimatedFare.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground font-medium">Estimated Fare</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border">
            <Navigation size={20} className="text-primary mx-auto mb-2" weight="bold" />
            <div className="text-xl font-bold text-primary">{request.estimatedDistance.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground font-medium">Miles</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border">
            <Clock size={20} className="text-accent mx-auto mb-2" weight="bold" />
            <div className="text-xl font-bold text-accent">{request.estimatedDuration}</div>
            <div className="text-xs text-muted-foreground font-medium">Minutes</div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm font-medium text-muted-foreground">Payment Method</span>
          <Badge variant="outline" className="font-semibold">
            {request.paymentMethod === 'cash' ? '💵 Cash' : 
             request.paymentMethod === 'card' ? '💳 Card' : '📱 Digital Wallet'}
          </Badge>
        </div>

        {/* Special Requests */}
        {request.specialRequests && (
          <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20">
            <div className="text-sm font-bold text-accent mb-2 flex items-center gap-2">
              <Star size={14} weight="fill" />
              Special Request
            </div>
            <div className="text-sm font-medium">{request.specialRequests}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onDecline(request.id)}
            className="h-14 border-3 border-destructive/60 text-destructive hover:bg-destructive hover:text-destructive-foreground font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Decline
          </Button>
          <Button 
            onClick={() => onAccept(request.id)}
            className="h-14 bg-gradient-to-r from-success via-accent to-success hover:from-success/90 hover:via-accent/90 hover:to-success/90 text-white font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-success/30"
          >
            Accept Ride
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}