import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, HandSwipeLeft, HandSwipeRight } from "@phosphor-icons/react";
import { useState, useEffect, useRef } from "react";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      onDecline(request.id);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
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
        {/* Earnings display */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-green-600 mb-2">
            £{request.estimatedFare.toFixed(2)}
          </div>
          <p className="text-gray-600">You earn</p>
        </div>

        {/* Trip metrics in single line */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <span>👤</span>
              <span className="font-medium">{request.passenger.rating.toFixed(1)}★</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📍</span>
              <span className="font-medium">{distanceToPickup.toFixed(1)}mi</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🚗</span>
              <span className="font-medium">{request.estimatedDistance.toFixed(1)}mi</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⏱️</span>
              <span className="font-medium">{request.estimatedDuration}min</span>
            </div>
          </div>
        </div>

        {/* Trip details sections */}
        <div className="space-y-4 mb-8">
          {/* To pickup */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-1">TO PICKUP</h3>
            <p className="text-gray-600">{distanceToPickup.toFixed(1)}mi • {timeToPickup}min</p>
          </div>

          {/* Trip length */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-1">TRIP LENGTH</h3>
            <p className="text-gray-600">{request.estimatedDistance.toFixed(1)}mi • {request.estimatedDuration}min</p>
          </div>

          {/* Route */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">ROUTE</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center">
                <span>📍</span>
                <span className="text-gray-900 font-medium">{request.pickup.address}</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span>🎯</span>
                <span className="text-gray-900 font-medium">{request.destination.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Swipe instruction */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <HandSwipeLeft size={16} />
              <span>Swipe left to decline</span>
            </div>
            <div className="flex items-center gap-1">
              <HandSwipeRight size={16} />
              <span>Swipe right to accept</span>
            </div>
          </div>
        </div>
      </div>

      {/* Swipeable card area */}
      <div 
        ref={cardRef}
        className={`mx-4 mb-6 rounded-xl border-2 transition-all duration-200 ${
          swipeDirection === 'accept' 
            ? 'bg-green-150 border-green-350' 
            : swipeDirection === 'decline'
            ? 'bg-red-150 border-red-350'
            : 'bg-white border-gray-200'
        }`}
        style={{
          transform: `translateX(${dragPosition}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {/* Action buttons */}
        <div className="flex gap-4 p-6">
          <Button
            onClick={() => onDecline(request.id)}
            variant="outline"
            size="lg"
            className="flex-1 h-14 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Decline
          </Button>
          <Button
            onClick={() => onAccept(request.id)}
            size="lg"
            className="flex-1 h-14 bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            Accept ✅
          </Button>
        </div>
      </div>
    </div>
  );
}