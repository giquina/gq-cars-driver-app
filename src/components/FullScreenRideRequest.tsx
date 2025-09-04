import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RideRequest } from "@/types/index";
import { 
  Phone, 
  Clock, 
  X,
  Star,
  CurrencyGbp
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

  // Prevent any scrolling or touch interactions
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
      style={{
        touchAction: 'none',
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[95vh] overflow-hidden animate-fade-in-scale modal-no-scroll"
        onTouchMove={handleTouchMove}
        style={{
          overflow: 'hidden',
          touchAction: 'none',
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-red-500" />
            <span className="text-sm font-semibold text-gray-900">
              New Request - {timeLeft}s
            </span>
          </div>
          <button 
            onClick={() => onDecline(request.id)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Passenger info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">
                {request.passenger.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{request.passenger.name}</h3>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">
                  {request.passenger.rating.toFixed(1)} • {request.passenger.tripCount} trips
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Phone size={14} />
            </Button>
          </div>

          {/* Route info */}
          <div className="space-y-3">
            {/* Pickup */}
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 uppercase tracking-wide">Pickup</p>
                <p className="font-medium text-gray-900 text-sm">{request.pickup.address}</p>
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 uppercase tracking-wide">Destination</p>
                <p className="font-medium text-gray-900 text-sm">{request.destination.address}</p>
              </div>
            </div>
          </div>

          {/* Trip details */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CurrencyGbp size={16} className="text-green-600" />
                <span className="font-bold text-lg text-gray-900">
                  £{request.estimatedFare.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {request.estimatedDistance.toFixed(1)}mi • {request.estimatedDuration}min
                </p>
                <p className="text-xs text-gray-500">{request.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Special requests */}
          {request.specialRequests && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-800">{request.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-4">
          <div className="flex gap-3">
            <Button 
              onClick={() => onDecline(request.id)}
              variant="outline" 
              className="flex-1 h-12 font-semibold"
            >
              Decline
            </Button>
            <Button 
              onClick={() => onAccept(request.id)}
              className="flex-1 h-12 bg-green-600 hover:bg-green-700 font-semibold"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}