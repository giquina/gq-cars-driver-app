import { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Timer, HandSwipeLeft, HandSwipeRight } from "@phosphor-icons/react";
interface FullScreenRideRequestProps {

  onDecline: (requestId: string) => vo
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function FullScreenRideRequest({ request, onAccept, onDecline }: FullScreenRideRequestProps) {
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
        return prev - 1;
    }, 1000);
    return () => clearInterval(time

  const handleTouchS
    const clientX =
  };
  const handleTouchMove = (e
    
    c

    const maxSwipe = window.innerWidt
    if (Math.abs(diffX) < m
      setDragPosition(ea
      // Set swipe 
        s
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
     
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
      </div>
    
    if (Math.abs(dragPosition) > threshold) {
      if (dragPosition > 0) {
        onAccept(request.id);
      } else {
          <p className="text-g
      }
        {/* 
      // Snap back to center
      setDragPosition(0);
      setSwipeDirection(null);
     
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
          {/

      {/* Progress bar */}
      <div className="px-4 pb-2">
          {/* Rout
          value={(timeLeft / 30) * 100} 
            <div classNam
        />
            

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center p-6">
            </div>
      </div>
  );






































































      </div>









































    </div>
  );
}