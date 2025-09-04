import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RideRequest } from "@/types/index";
import { 
  Phone, 
  Clock, 
  X,
  Star,
  CurrencyGbp,
  MapPin,
  Navigation
} from "@phosphor-icons/react";

interface FullScreenRideRequestProps {
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function FullScreenRideRequest({ request, onAccept, onDecline }: FullScreenRideRequestProps) {
  const [timeLeft, setTimeLeft] = useState(15);

  // Countdown timer
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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-scale">
        {/* Header with countdown */}
        <div className="bg-red-500 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-white" />
              <span className="font-bold">New Ride Request</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="font-bold text-sm">{timeLeft}s</span>
              </div>
              <button 
                onClick={handleDecline}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Passenger Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-gray-700">
                {request.passenger.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{request.passenger.name}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 font-medium">
                    {request.passenger.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">
                  {request.passenger.tripCount} trips
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0 border-gray-300"
            >
              <Phone size={16} className="text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Route Information */}
        <div className="p-4 space-y-4">
          {/* Pickup Location */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <div className="w-0.5 h-6 bg-gray-300 mt-1" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">
                Pickup
              </p>
              <p className="font-medium text-gray-900 text-sm leading-tight">
                {request.pickup.address}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">
                Destination
              </p>
              <p className="font-medium text-gray-900 text-sm leading-tight">
                {request.destination.address}
              </p>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="px-4 pb-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CurrencyGbp size={20} className="text-green-600" />
                <span className="text-2xl font-bold text-gray-900">
                  £{request.estimatedFare.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-gray-600">
                  <Navigation size={14} />
                  <span className="text-sm font-medium">
                    {request.estimatedDistance.toFixed(1)} mi
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={14} />
                  <span className="text-sm font-medium">
                    {request.estimatedDuration} min
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment method</span>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {request.paymentMethod.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Special Requests */}
          {request.specialRequests && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">
                    Special Request
                  </p>
                  <p className="text-sm text-blue-800">
                    {request.specialRequests}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 pt-0">
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
              className="h-12 bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg"
              size="lg"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}