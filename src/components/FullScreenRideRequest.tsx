import { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Timer, HandSwipeLeft, HandSwipeRight, MapPin, Star, Phone } from "@phosphor-icons/react";
import { RideRequest } from "@/types";

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

  // Touch/mouse event handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diffX = clientX - startX.current;
    
    // Limit swipe distance with resistance
    const resistance = 0.6;
    const maxSwipe = window.innerWidth * 0.4;
    
    if (Math.abs(diffX) < maxSwipe) {
      const easedDiff = diffX * resistance;
      setDragPosition(easedDiff);
      
      // Set swipe direction for visual feedback
      if (Math.abs(easedDiff) > 50) {
        setSwipeDirection(easedDiff > 0 ? 'accept' : 'decline');
      } else {
        setSwipeDirection(null);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Trigger action if swipe is far enough
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
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h1 className="text-lg font-bold text-gray-900">New Ride Request</h1>
        <div className="flex items-center gap-2">
          <Timer size={18} className="text-orange-600" />
          <span className="text-sm font-bold text-orange-600">{timeLeft}s</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-2">
        <Progress 
          value={(timeLeft / 30) * 100} 
          className="h-1"
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center p-6">
        {/* Passenger info */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-700">
              {request.passenger.name.charAt(0)}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {request.passenger.name}
          </h2>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500" weight="fill" />
              <span>{request.passenger.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span>{request.passenger.tripCount} trips</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>{request.passenger.phone}</span>
            </div>
          </div>
        </div>

        {/* Route info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-3">
            {/* Pickup */}
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-600">Pickup</p>
                <p className="font-medium text-gray-900">{request.pickup.address}</p>
              </div>
            </div>
            
            {/* Destination */}
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-600">Destination</p>
                <p className="font-medium text-gray-900">{request.destination.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trip details */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">£{request.estimatedFare.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Estimated fare</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{request.estimatedDistance.toFixed(1)}mi</p>
            <p className="text-sm text-gray-600">Distance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{request.estimatedDuration}min</p>
            <p className="text-sm text-gray-600">Duration</p>
          </div>
        </div>

        {/* Time to pickup */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2">
            <MapPin size={16} className="text-blue-600" />
            <span className="text-sm text-gray-600">
              {timeToPickup} min to pickup • {distanceToPickup.toFixed(1)} mi away
            </span>
          </div>
        </div>

        {/* Special requests */}
        {request.specialRequests && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> {request.specialRequests}
            </p>
          </div>
        )}
      </div>

      {/* Swipe action area */}
      <div className="p-6">
        <div 
          className={`relative bg-gray-100 rounded-2xl p-4 transition-all duration-200 ${
            swipeDirection === 'accept' ? 'bg-green-150 border-green-350' : 
            swipeDirection === 'decline' ? 'bg-red-150 border-red-350' : 
            'border-gray-200'
          } border-2`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          {/* Swipe instructions */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <HandSwipeLeft size={16} className="text-red-500" />
              <span>Swipe left to decline</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Swipe right to accept</span>
              <HandSwipeRight size={16} className="text-green-500" />
            </div>
          </div>

          {/* Swipeable element */}
          <div 
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all duration-200 ${
              swipeDirection === 'accept' ? 'bg-green-500 text-white' :
              swipeDirection === 'decline' ? 'bg-red-500 text-white' :
              'bg-white border-2 border-gray-300'
            }`}
            style={{
              transform: `translateX(${dragPosition}px)`,
            }}
          >
            {swipeDirection === 'accept' ? '✓' : 
             swipeDirection === 'decline' ? '✗' : 
             '⟷'}
          </div>

          {/* Background hints */}
          <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
            <div className={`transition-opacity duration-200 ${swipeDirection === 'decline' ? 'opacity-100' : 'opacity-30'}`}>
              <span className="text-red-500 font-bold">DECLINE</span>
            </div>
            <div className={`transition-opacity duration-200 ${swipeDirection === 'accept' ? 'opacity-100' : 'opacity-30'}`}>
              <span className="text-green-500 font-bold">ACCEPT</span>
            </div>
          </div>
        </div>

        {/* Fallback buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => onDecline(request.id)}
            className="flex-1 bg-red-500 text-white font-bold py-4 rounded-xl"
          >
            Decline
          </button>
          <button
            onClick={() => onAccept(request.id)}
            className="flex-1 bg-green-500 text-white font-bold py-4 rounded-xl"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}