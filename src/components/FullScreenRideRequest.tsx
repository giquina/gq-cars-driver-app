import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RideRequest } from "@/types";
import { 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  CurrencyGbp,
  HandSwipeLeft,
  HandSwipeRight,
  X,
  Check
} from "@phosphor-icons/react";

interface FullScreenRideRequestProps {
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function FullScreenRideRequest({ request, onAccept, onDecline }: FullScreenRideRequestProps) {
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'accept' | 'decline' | null>(null);
  const startX = useRef(0);

  // Auto-decline timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onDecline(request.id);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, request.id, onDecline]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const dragPos = currentX - startX.current;
    setDragPosition(dragPos);
    
    // Visual feedback based on direction
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
    
    const threshold = 100;
    if (Math.abs(dragPosition) > threshold) {
      if (dragPosition > 0) {
        onAccept(request.id);
      } else {
        onDecline(request.id);
      }
    } else {
      // Snap back to center
      setDragPosition(0);
      setSwipeDirection(null);
    }
  };

  // Calculate distance to pickup
  const distanceToPickup = request.estimatedDistance * 0.3; // Rough estimate
  const timeToPickup = Math.round(distanceToPickup * 2.5); // Rough time estimate

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col no-select">
      {/* Header with timer */}
      <div className="bg-red-500 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">New Ride Request</h2>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span className="font-bold">{timeLeft}s</span>
          </div>
        </div>
        <Progress 
          value={(timeLeft / 30) * 100} 
          className="h-1 mt-2"
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Passenger info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-600">
              {request.passenger.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{request.passenger.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Star size={14} className="text-yellow-500" weight="fill" />
              <span className="text-sm text-gray-600">{request.passenger.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-600">{request.passenger.tripCount} trips</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Phone size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">{request.passenger.phone}</span>
            </div>
          </div>
        </div>

        {/* Trip details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-4">
            {/* Pickup */}
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">PICKUP</p>
                <p className="text-gray-900">{request.pickup.address}</p>
                <p className="text-sm text-gray-600 mt-1">{timeToPickup} min away</p>
              </div>
            </div>
            
            {/* Destination */}
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">DROP-OFF</p>
                <p className="text-gray-900">{request.destination.address}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {request.estimatedDistance.toFixed(1)} mi • {request.estimatedDuration} min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fare info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-green-700 font-medium">Estimated Fare</span>
            <div className="flex items-center gap-1">
              <CurrencyGbp size={18} className="text-green-700" />
              <span className="text-xl font-bold text-green-700">
                {request.estimatedFare.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-1">Payment: {request.paymentMethod}</p>
        </div>

        {/* Special requests */}
        {request.specialRequests && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900">
              <strong>Note:</strong> {request.specialRequests}
            </p>
          </div>
        )}
      </div>

      {/* Swipe to respond */}
      <div className="px-4 pb-6">
        <div 
          className={`relative bg-gray-100 rounded-full h-20 flex items-center justify-center mb-4 transition-all duration-200 ${
            swipeDirection === 'accept' ? 'bg-green-150 border-green-350' : 
            swipeDirection === 'decline' ? 'bg-red-150 border-red-350' : 
            'border-gray-200'
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Instructions */}
          <div className="absolute left-6 flex items-center gap-2 text-gray-500">
            <HandSwipeLeft size={16} />
            <span>Swipe left to decline</span>
          </div>
          <div className="absolute right-6 flex items-center gap-2 text-gray-500">
            <span>Swipe right to accept</span>
            <HandSwipeRight size={16} />
          </div>
          
          {/* Swipeable element */}
          <div 
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
              swipeDirection === 'accept' ? 'bg-green-500' : 
              swipeDirection === 'decline' ? 'bg-red-500' : 'bg-white shadow-lg'
            }`}
            style={{
              transform: `translateX(${dragPosition}px)`,
            }}
          >
            {swipeDirection === 'accept' ? (
              <Check size={24} className="text-white" weight="bold" />
            ) : swipeDirection === 'decline' ? (
              <X size={24} className="text-white" weight="bold" />
            ) : (
              <div className="w-8 h-1 bg-gray-400 rounded-full"></div>
            )}
          </div>
          
          {/* Background hints */}
          <div className={`absolute left-4 transition-opacity duration-200 ${swipeDirection === 'decline' ? 'opacity-100' : 'opacity-0'}`}>
            <X size={24} className="text-red-500" weight="bold" />
          </div>
          <div className={`absolute right-4 transition-opacity duration-200 ${swipeDirection === 'accept' ? 'opacity-100' : 'opacity-0'}`}>
            <Check size={24} className="text-green-500" weight="bold" />
          </div>
        </div>

        {/* Fallback buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => onDecline(request.id)}
          >
            <X size={18} className="mr-2" />
            Decline
          </Button>
          <Button 
            size="lg" 
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            onClick={() => onAccept(request.id)}
          >
            <Check size={18} className="mr-2" />
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}