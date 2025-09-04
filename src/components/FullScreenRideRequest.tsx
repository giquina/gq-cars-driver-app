import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RideRequest } from "@/types";
import { Timer, HandSwipeLeft, HandSwipeRight } from "@phosphor-icons/react";
import { useState, useEffect, useRef } from "react";

interface FullScreenRideRequestProps {
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function FullScreenRideRequest({ request, onAccept, onDecline }: FullScreenRideRequestProps) {
  const [timeLeft, setTimeLeft] = useState(26); // 26 second countdown
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onDecline(request.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [request.id, onDecline]);

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentX.current = e.touches[0].clientX;
    const diffX = currentX.current - startX.current;
    
    // Limit swipe distance with resistance
    const maxSwipe = 150;
    const resistance = 0.3;
    let clampedDiff;
    
    if (Math.abs(diffX) > maxSwipe) {
      const extraDistance = Math.abs(diffX) - maxSwipe;
      const resistedExtra = extraDistance * resistance;
      clampedDiff = diffX > 0 ? maxSwipe + resistedExtra : -(maxSwipe + resistedExtra);
    } else {
      clampedDiff = diffX;
    }
    
    setSwipeOffset(clampedDiff);

    // Haptic feedback
    const threshold = 80;
    const strongThreshold = 120;
    
    if (Math.abs(diffX) > strongThreshold && Math.abs(diffX) <= strongThreshold + 5) {
      if (navigator.vibrate) {
        navigator.vibrate([30, 20, 30]);
      }
    } else if (Math.abs(diffX) > threshold && Math.abs(diffX) <= threshold + 5) {
      if (navigator.vibrate) {
        navigator.vibrate(40);
      }
    }
    
    e.preventDefault();
  };

  const handleTouchEnd = (e?: React.TouchEvent) => {
    if (!isDragging) return;
    
    const diffX = currentX.current - startX.current;
    const threshold = 80;
    const commitThreshold = 120;
    
    if (Math.abs(diffX) > commitThreshold) {
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }
    
    if (diffX > threshold) {
      onAccept(request.id);
    } else if (diffX < -threshold) {
      onDecline(request.id);
    } else {
      if (navigator.vibrate && Math.abs(diffX) > 20) {
        navigator.vibrate(20);
      }
    }
    
    setSwipeOffset(0);
    setIsDragging(false);
    
    if (e) {
      e.preventDefault();
    }
  };

  const progressPercentage = (timeLeft / 26) * 100;
  const pickupDistance = (Math.random() * 3 + 0.5).toFixed(1);

  // Visual feedback for swipe direction
  const getSwipeBackground = () => {
    const lightThreshold = 40;
    const mediumThreshold = 80;
    const strongThreshold = 120;
    
    if (swipeOffset > strongThreshold) {
      return 'bg-green-100 border-green-300';
    } else if (swipeOffset > mediumThreshold) {
      return 'bg-green-50 border-green-200';
    } else if (swipeOffset > lightThreshold) {
      return 'bg-green-25 border-green-100';
    } else if (swipeOffset < -strongThreshold) {
      return 'bg-red-100 border-red-300';
    } else if (swipeOffset < -mediumThreshold) {
      return 'bg-red-50 border-red-200';
    } else if (swipeOffset < -lightThreshold) {
      return 'bg-red-25 border-red-100';
    }
    return 'bg-white';
  };

  const getSwipeIndicator = () => {
    const mediumThreshold = 80;
    const strongThreshold = 120;
    
    if (swipeOffset > mediumThreshold) {
      const opacity = Math.min(1, (Math.abs(swipeOffset) - mediumThreshold) / 40);
      const isStrong = swipeOffset > strongThreshold;
      
      return (
        <div 
          className={`fixed right-8 top-1/2 -translate-y-1/2 flex items-center gap-3 transition-all duration-100 ${
            isStrong ? 'text-green-700' : 'text-green-600'
          } z-50`}
          style={{ opacity }}
        >
          <HandSwipeRight size={isStrong ? 32 : 28} weight="bold" />
          <span className={`font-bold ${isStrong ? 'text-xl' : 'text-lg'}`}>
            {isStrong ? 'ACCEPT!' : 'Accept'}
          </span>
        </div>
      );
    } else if (swipeOffset < -mediumThreshold) {
      const opacity = Math.min(1, (Math.abs(swipeOffset) - mediumThreshold) / 40);
      const isStrong = swipeOffset < -strongThreshold;
      
      return (
        <div 
          className={`fixed left-8 top-1/2 -translate-y-1/2 flex items-center gap-3 transition-all duration-100 ${
            isStrong ? 'text-red-700' : 'text-red-600'
          } z-50`}
          style={{ opacity }}
        >
          <HandSwipeLeft size={isStrong ? 32 : 28} weight="bold" />
          <span className={`font-bold ${isStrong ? 'text-xl' : 'text-lg'}`}>
            {isStrong ? 'DECLINE!' : 'Decline'}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      ref={screenRef}
      className={`fixed inset-0 z-50 flex flex-col transition-all duration-200 no-select animate-fade-in-full ${getSwipeBackground()}`}
      style={{
        transform: `translateX(${swipeOffset}px)`,
        transition: isDragging ? 'transform 0.1s ease-out' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe indicator */}
      {getSwipeIndicator()}

      {/* Swipe instruction at top */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 bg-black/80 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
          <div className="flex items-center gap-2">
            <HandSwipeLeft size={16} />
            <span>Swipe left to decline</span>
          </div>
          <div className="w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2">
            <HandSwipeRight size={16} />
            <span>Swipe right to accept</span>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="pt-20 pb-4 px-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">New Ride Request</h1>
          <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
            <Timer size={18} className="text-orange-600" />
            <span className="text-orange-700 font-bold text-lg">{timeLeft}s</span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 pb-6 flex flex-col justify-center space-y-8">
        
        {/* Earnings Display - Primary Focus */}
        <div className="text-center py-8">
          <div className="text-6xl font-bold text-green-600 mb-2">
            £{request.estimatedFare.toFixed(2)}
          </div>
          <div className="text-xl text-gray-600 font-medium">You earn</div>
        </div>

        {/* Quick Metrics Line */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👤</span>
              <span className="text-xl font-bold text-gray-900">{request.passenger.rating.toFixed(1)}★</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <span className="text-xl font-bold text-blue-900">{pickupDistance}mi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚗</span>
              <span className="text-xl font-bold text-purple-900">{request.estimatedDistance.toFixed(1)}mi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <span className="text-xl font-bold text-gray-900">{request.estimatedDuration}min</span>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-6">
          {/* To Pickup */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="text-blue-700 font-bold text-lg uppercase tracking-wide mb-3">To Pickup</div>
            <div className="text-2xl font-bold text-blue-900">{pickupDistance}mi • {Math.ceil(parseFloat(pickupDistance) * 2.5)}min</div>
          </div>

          {/* Trip Length */}
          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
            <div className="text-purple-700 font-bold text-lg uppercase tracking-wide mb-3">Trip Length</div>
            <div className="text-2xl font-bold text-purple-900">{request.estimatedDistance.toFixed(1)}mi • {request.estimatedDuration}min</div>
          </div>
        </div>

        {/* Route Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-gray-600 font-bold text-lg uppercase tracking-wide mb-4">Route</div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-1">📍</span>
              <div>
                <div className="text-gray-500 text-sm font-medium uppercase">Pickup</div>
                <div className="text-lg font-semibold text-gray-900 leading-tight">
                  {request.pickup.address}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-1">🎯</span>
              <div>
                <div className="text-gray-500 text-sm font-medium uppercase">Destination</div>
                <div className="text-lg font-semibold text-gray-900 leading-tight">
                  {request.destination.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Bottom */}
      <div className="p-6 pb-12">
        <div className="grid grid-cols-2 gap-6">
          <Button 
            variant="outline" 
            onClick={() => onDecline(request.id)}
            className="h-16 text-xl border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-bold rounded-2xl"
            disabled={isDragging}
            size="lg"
          >
            Decline
          </Button>
          <Button 
            onClick={() => onAccept(request.id)}
            className="h-16 text-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg rounded-2xl"
            disabled={isDragging}
            size="lg"
          >
            Accept ✅
          </Button>
        </div>
      </div>
    </div>
  );
}