import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RideRequest } from "@/types/index";
import { 
  Clock, 
  Star, 
  MapPin,
  CurrencyGbp,
  Phone,
  X
} from "@phosphor-icons/react";

interface FullScreenRideRequestProps {
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function FullScreenRideRequest({ request, onAccept, onDecline }: FullScreenRideRequestProps) {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (timeLeft <= 0) {
      onDecline(request.id);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onDecline, request.id]);

  // Prevent any scrolling on the modal
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 modal-no-scroll"
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
      style={{ touchAction: 'none', overflow: 'hidden' }}
    >
      {/* Modal container - compact design fitting in viewport */}
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto animate-fade-in-scale modal-no-scroll"
        onTouchMove={handleTouchMove}
        onWheel={handleWheel}
        style={{ 
          touchAction: 'none', 
          overflow: 'hidden',
          maxHeight: '90vh' // Ensure it fits in viewport
        }}
      >
        {/* Header with timer */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-red-500" />
              <span className="font-semibold text-red-500">
                {timeLeft}s
              </span>
            </div>
            <button 
              onClick={() => onDecline(request.id)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="p-4 space-y-3">
          {/* Passenger info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-gray-600">
                {request.passenger.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">{request.passenger.name}</h3>
              <div className="flex items-center gap-1">
                <Star size={11} className="text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">
                  {request.passenger.rating.toFixed(1)} • {request.passenger.tripCount} trips
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
            >
              <Phone size={12} />
            </Button>
          </div>

          {/* Route info */}
          <div className="space-y-2">
            {/* Pickup */}
            <div className="flex items-start gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 uppercase tracking-wide">Pickup</p>
                <p className="font-medium text-gray-900 text-xs leading-tight">{request.pickup.address}</p>
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-start gap-2">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 uppercase tracking-wide">Destination</p>
                <p className="font-medium text-gray-900 text-xs leading-tight">{request.destination.address}</p>
              </div>
            </div>
          </div>

          {/* Trip details */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CurrencyGbp size={14} className="text-green-600" />
                <span className="font-bold text-lg text-gray-900">
                  £{request.estimatedFare.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">
                  {request.estimatedDistance.toFixed(1)}mi • {request.estimatedDuration}min
                </p>
                <p className="text-xs text-gray-500">{request.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Special requests */}
          {request.specialRequests && (
            <div className="bg-blue-50 rounded-lg p-2">
              <p className="text-xs text-blue-800">{request.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-4">
          <div className="flex gap-3">
            <Button 
              onClick={() => onDecline(request.id)}
              variant="outline" 
              className="flex-1 h-10 font-semibold"
            >
              Decline
            </Button>
            <Button 
              onClick={() => onAccept(request.id)}
              className="flex-1 h-10 bg-green-600 hover:bg-green-700 font-semibold"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}