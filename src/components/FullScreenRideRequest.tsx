import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RideRequest } from "@/types/index";
import { 
  Clock, 
  Phone, 
  Star, 
  CurrencyGbp,
  MapPin,
  Navigation,
  User
} from "@phosphor-icons/react";

interface FullScreenRideRequestProps {
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function FullScreenRideRequest({ request, onAccept, onDecline }: FullScreenRideRequestProps) {
  const [timeLeft, setTimeLeft] = useState(25);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onDecline(request.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [request.id, onDecline]);

  const handleAccept = () => {
    onAccept(request.id);
  };

  const handleDecline = () => {
    onDecline(request.id);
  };

  // Calculate pickup distance for display
  const pickupDistance = 1.0 + Math.random() * 3; // Mock pickup distance
  const pickupTime = Math.ceil(pickupDistance * 2.5); // Estimated time to pickup

  return (
    <div className="fixed inset-0 bg-gray-900/95 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden animate-fade-in-scale">
        
        {/* Header with timer */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 text-center relative">
          <div className="text-sm font-medium mb-1">New Ride Request</div>
          <div className="text-2xl font-bold">{timeLeft}s</div>
          <div className="absolute bottom-0 left-0 h-1 bg-red-300 transition-all duration-1000 ease-linear" 
               style={{ width: `${(timeLeft / 25) * 100}%` }} />
        </div>

        {/* Earnings Display */}
        <div className="p-6 text-center bg-white">
          <div className="text-3xl font-bold text-green-600 mb-1">
            £{request.estimatedFare.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">You earn</div>
        </div>

        {/* Quick metrics in single line */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <User size={16} className="text-gray-500" />
              <span className="font-medium">{request.passenger.rating.toFixed(1)}★</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} className="text-gray-500" />
              <span className="font-medium">{pickupDistance.toFixed(1)}mi</span>
            </div>
            <div className="flex items-center gap-1">
              <Navigation size={16} className="text-gray-500" />
              <span className="font-medium">{request.estimatedDistance.toFixed(1)}mi</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-gray-500" />
              <span className="font-medium">{request.estimatedDuration}min</span>
            </div>
          </div>
        </div>

        {/* Trip breakdown */}
        <div className="px-6 pb-4 space-y-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">
              TO PICKUP
            </div>
            <div className="text-sm font-medium text-blue-900">
              {pickupDistance.toFixed(1)}mi • {pickupTime}min
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">
              TRIP LENGTH
            </div>
            <div className="text-sm font-medium text-green-900">
              {request.estimatedDistance.toFixed(1)}mi • {request.estimatedDuration}min
            </div>
          </div>
        </div>

        {/* Route information */}
        <div className="px-6 pb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
              ROUTE
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <div className="text-sm text-gray-900 leading-tight">
                  {request.pickup.address}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                <div className="text-sm text-gray-900 leading-tight">
                  {request.destination.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 pt-0">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleDecline}
              variant="outline" 
              className="h-12 font-bold border-2 hover:bg-gray-50"
              size="lg"
            >
              Decline
            </Button>
            <Button 
              onClick={handleAccept}
              className="h-12 bg-green-600 hover:bg-green-700 text-white font-bold"
              size="lg"
            >
              Accept ✅
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}