import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RideRequest } from "@/types";
import { MapPin, Clock, Star, Timer, User, Navigation } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

interface RideRequestCardProps {
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function RideRequestCard({ request, onAccept, onDecline }: RideRequestCardProps) {
  const [timeLeft, setTimeLeft] = useState(26); // 26 second countdown (more realistic)

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

  const progressPercentage = (timeLeft / 26) * 100;

  // Extract simple area names from full addresses
  const getAreaName = (address: string) => {
    // Simple logic to extract area - in real app would use proper geocoding
    if (address.includes('Chelsea')) return 'Chelsea';
    if (address.includes('Camden')) return 'Camden';
    if (address.includes('Oxford')) return 'Central London';
    if (address.includes('Canary Wharf')) return 'Canary Wharf';
    if (address.includes('Heathrow')) return 'Heathrow';
    if (address.includes('Westminster')) return 'Westminster';
    if (address.includes('Greenwich')) return 'Greenwich';
    // Fallback: take first part before comma
    return address.split(',')[0];
  };

  // Calculate pickup distance (mock - in real app would use GPS)
  const pickupDistance = (Math.random() * 3 + 0.5).toFixed(1); // 0.5-3.5 miles

  return (
    <Card className="w-full max-w-sm mx-auto bg-white shadow-2xl border-0 animate-fade-in-scale">
      {/* Minimal Header with Timer */}
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">New Ride Request</h3>
          <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
            <Timer size={12} className="text-orange-600" />
            <span className="text-orange-700 font-bold text-xs">{timeLeft}s</span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-1 mt-2" />
      </CardHeader>
      
      <CardContent className="px-4 pb-4 space-y-4">
        {/* BIG EARNINGS DISPLAY - Most Important */}
        <div className="text-center py-2">
          <div className="text-4xl font-bold text-green-600 mb-1">
            £{request.estimatedFare.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600 font-medium">You earn</div>
        </div>

        {/* Core Decision Info - Single Line Format */}
        <div className="flex items-center justify-between py-3 bg-gray-50 rounded-lg px-4">
          <div className="flex items-center gap-1">
            <User size={16} className="text-gray-600" />
            <span className="text-lg font-bold text-yellow-600">{request.passenger.rating.toFixed(1)}★</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-blue-600" />
            <span className="text-lg font-bold text-blue-700">{pickupDistance}mi away</span>
          </div>
        </div>

        {/* Trip Distance & Duration */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-1">
            <Navigation size={16} className="text-purple-600" />
            <span className="text-lg font-bold text-gray-900">{request.estimatedDistance.toFixed(1)}mi</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-green-600" />
            <span className="text-lg font-bold text-gray-900">{request.estimatedDuration}min</span>
          </div>
        </div>

        {/* Simple Area Route */}
        <div className="text-center py-2 bg-blue-50 rounded-lg">
          <div className="text-base font-semibold text-gray-900">
            {getAreaName(request.pickup.address)} → {getAreaName(request.destination.address)}
          </div>
        </div>

        {/* Payment & Notes (Only if NOT default card) */}
        <div className="space-y-2">
          {request.paymentMethod !== 'card' && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-base">
                {request.paymentMethod === 'cash' ? '💰' : '📱'}
              </span>
              <span className="font-medium text-gray-900">
                {request.paymentMethod === 'cash' ? 'Cash Payment' : 'Digital Wallet'}
              </span>
            </div>
          )}
          
          {request.specialRequests && request.specialRequests.length < 30 && (
            <div className="flex items-start gap-2 text-sm bg-yellow-50 p-2 rounded border border-yellow-200">
              <span className="text-base">📝</span>
              <span className="text-gray-900 font-medium">"{request.specialRequests}"</span>
            </div>
          )}
        </div>

        {/* Large Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={() => onDecline(request.id)}
            className="h-12 border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-bold text-base"
          >
            Decline
          </Button>
          <Button 
            onClick={() => onAccept(request.id)}
            className="h-12 bg-green-600 hover:bg-green-700 text-white font-bold text-base shadow-md"
          >
            Accept ✅
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}