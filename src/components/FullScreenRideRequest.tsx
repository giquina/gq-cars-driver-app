import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Phone, 
  HandSwipeRight,
  X,
  Check,
  MapPin,
  Clock,
  CurrencyGbp
} from "@phosphor-icons/react";
import { RideRequest } from "@/types";

interface FullScreenRideRequestProps {
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function FullScreenRideRequest({ request, onAccept, onDecline }: FullScreenRideRequestProps) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'accept' | 'decline' | null>(null);
  const startX = useRef(0);
  const containerWidth = useRef(0);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
    containerWidth.current = e.currentTarget.offsetWidth;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const dragPos = currentX - startX.current;
    
    setDragPosition(dragPos);
    
    // Visual feedback based on swipe direction and distance
    if (dragPos > 50) {
      setSwipeDirection('accept');
    } else if (dragPos < -50) {
      setSwipeDirection('decline');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (dragPosition > 100) {
      onAccept(request.id);
    } else if (dragPosition < -100) {
      onDecline(request.id);
    } else {
      // Snap back to center
      setDragPosition(0);
      setSwipeDirection(null);
    }
  };

  // Calculate distance to pickup (mock calculation)
  const distanceToPickup = 0.8 + Math.random() * 1.5; // km

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 ride-request-overlay flex items-center justify-center z-50 p-[2.5%]">
      {/* Main container taking 95% of screen */}
      <div className={`
        bg-white rounded-2xl shadow-2xl border border-gray-200 w-full h-full
        ride-request-container flex flex-col animate-fade-in-scale no-select
        ${swipeDirection === 'accept' ? 'bg-green-150 border-green-350' : 
          swipeDirection === 'decline' ? 'bg-red-150 border-red-350' : 
          'border-gray-200'}
      `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header with timer */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center">
              <Clock size={14} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">New Ride Request</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-1000 ease-linear" 
                style={{ width: `${(timeLeft / 15) * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold text-red-600">{timeLeft}s</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-3 py-4 overflow-y-auto min-h-0 max-h-[60vh]">
          {/* Passenger info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-base font-bold text-gray-600">
                {request.passenger.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-sm">{request.passenger.name}</span>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-500" weight="fill" />
                  <span className="text-xs text-gray-600">{request.passenger.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600">{request.passenger.tripCount} trips</p>
            </div>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Phone size={14} />
            </Button>
          </div>

          {/* Distance and time */}
          <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-base font-bold text-gray-900">{distanceToPickup.toFixed(1)} km</div>
              <div className="text-xs text-gray-600">to pickup</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-gray-900">{Math.ceil(distanceToPickup * 2)} min</div>
              <div className="text-xs text-gray-600">away</div>
            </div>
          </div>

          {/* Route info */}
          <div className="space-y-3 mb-4">
            {/* Pickup */}
            <div className="flex items-start gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-600">Pickup</p>
                <p className="font-medium text-gray-900 text-sm">{request.pickup.address}</p>
              </div>
            </div>
            
            {/* Destination */}
            <div className="flex items-start gap-2">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-600">Destination</p>
                <p className="font-medium text-gray-900 text-sm">{request.destination.address}</p>
              </div>
            </div>
          </div>

          {/* Fare info */}
          <div className="bg-green-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CurrencyGbp size={16} className="text-green-600" />
                <span className="text-xs text-gray-700">Estimated fare</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-700">
                  £{request.estimatedFare.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">
                  {request.estimatedDistance.toFixed(1)} mi • {request.estimatedDuration} min
                </div>
              </div>
            </div>
          </div>

          {/* Special requests */}
          {request.specialRequests && (
            <div className="bg-blue-50 rounded-lg p-2 mb-4">
              <p className="text-xs text-blue-800">{request.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Swipe to respond */}
        <div className="p-3 border-t border-gray-200 bg-white rounded-b-2xl flex-shrink-0">
          <div className={`
            relative h-12 bg-gray-100 rounded-2xl overflow-hidden mb-3
            ${swipeDirection === 'accept' ? 'bg-green-150 border-green-350' : 
              swipeDirection === 'decline' ? 'bg-red-150 border-red-350' : 
              'border-gray-200'}
          `}>
            {/* Swipe instruction */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 text-gray-500">
                <HandSwipeRight size={16} />
                <span className="text-sm">Swipe right to accept</span>
              </div>
            </div>

            {/* Background hints */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-green-600">
              <Check size={16} />
              <span className="font-medium text-sm">Accept</span>
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-red-600">
              <span className="font-medium text-sm">Decline</span>
              <X size={16} />
            </div>

            {/* Swipeable element */}
            <div 
              className={`
                absolute top-1 left-1 w-10 h-10 bg-white rounded-xl shadow-lg
                flex items-center justify-center transition-transform
                ${isDragging ? 'scale-110' : 'scale-100'}
              `}
              style={{
                transform: `translateX(${dragPosition}px)`,
              }}
            >
              {swipeDirection === 'accept' ? (
                <Check size={20} className="text-green-600" />
              ) : swipeDirection === 'decline' ? (
                <X size={20} className="text-red-600" />
              ) : (
                <HandSwipeRight size={20} className="text-gray-400" />
              )}
            </div>
          </div>

          {/* Fallback buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-10"
              onClick={() => onDecline(request.id)}
            >
              <X size={16} className="mr-1" />
              Decline
            </Button>
            <Button 
              size="sm" 
              className="flex-1 h-10 bg-green-600 hover:bg-green-700"
              onClick={() => onAccept(request.id)}
            >
              <Check size={16} className="mr-1" />
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}