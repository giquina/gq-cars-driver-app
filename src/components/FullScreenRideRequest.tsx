import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RideRequest } from "@/types/index";
import { 
  Clock, 
  Phone, 
  Star, 
  X,
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
    <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[95vh] overflow-hidden animate-fade-in-scale">
        {/* Header with timer */}
        <div className="bg-red-500 text-white p-4 text-center relative">
          <div className="text-3xl font-bold mb-1">{timeLeft}s</div>
          <div className="text-sm opacity-90">New ride request</div>
          <div className={`absolute inset-x-0 bottom-0 h-1 bg-red-300 transition-all duration-1000 ease-linear`} 
               style={{ width: `${(timeLeft / 15) * 100}%` }} />
        </div>

        {/* Passenger Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{request.passenger.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500" weight="fill" />
                  <span className="text-sm font-medium text-gray-700">
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
              className="h-8 w-8 p-0 rounded-full"
            >
              <Phone size={16} />
            </Button>
          </div>
        </div>

        {/* Route Info */}
        <div className="p-4 space-y-3">
          {/* Pickup */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center mt-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div className="w-0.5 h-8 bg-gray-300 my-1" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">
                Pickup
              </p>
              <p className="font-medium text-gray-900 text-sm leading-tight">
                {request.pickup.address}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center mt-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-1">
                Destination
              </p>
              <p className="font-medium text-gray-900 text-sm leading-tight">
                {request.destination.address}
              </p>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <CurrencyGbp size={16} className="text-green-600" />
                <span className="text-lg font-bold text-green-600">
                  {request.estimatedFare.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-600">Fare</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Navigation size={16} className="text-blue-600" />
                <span className="text-lg font-bold text-gray-900">
                  {request.estimatedDistance.toFixed(1)}mi
                </span>
              </div>
              <div className="text-xs text-gray-600">Distance</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock size={16} className="text-orange-600" />
                <span className="text-lg font-bold text-gray-900">
                  {request.estimatedDuration} min
                </span>
              </div>
              <div className="text-xs text-gray-600">Duration</div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
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