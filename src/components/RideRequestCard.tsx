import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RideRequest } from "@/types";
import { MapPin, Clock, Star, Timer, User, Navigation, HandSwipeLeft, HandSwipeRight } from "@phosphor-icons/react";
import { useState, useEffect, useRef } from "react";

interface RideRequestCardProps {
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function RideRequestCard({ request, onAccept, onDecline }: RideRequestCardProps) {
  const [timeLeft, setTimeLeft] = useState(26); // 26 second countdown (more realistic)
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
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
    e.preventDefault(); // Prevent scrolling while swiping
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentX.current = e.touches[0].clientX;
    const diffX = currentX.current - startX.current;
    
    // Limit swipe distance with slight resistance beyond max
    const maxSwipe = 150;
    const resistance = 0.3; // Resistance factor beyond max swipe
    let clampedDiff;
    
    if (Math.abs(diffX) > maxSwipe) {
      const extraDistance = Math.abs(diffX) - maxSwipe;
      const resistedExtra = extraDistance * resistance;
      clampedDiff = diffX > 0 ? maxSwipe + resistedExtra : -(maxSwipe + resistedExtra);
    } else {
      clampedDiff = diffX;
    }
    
    setSwipeOffset(clampedDiff);

    // Enhanced haptic feedback with different intensities
    const threshold = 80;
    const strongThreshold = 120;
    
    if (Math.abs(diffX) > strongThreshold && Math.abs(diffX) <= strongThreshold + 5) {
      // Strong feedback for commit threshold
      if (navigator.vibrate) {
        navigator.vibrate([30, 20, 30]);
      }
    } else if (Math.abs(diffX) > threshold && Math.abs(diffX) <= threshold + 5) {
      // Light feedback for activation threshold
      if (navigator.vibrate) {
        navigator.vibrate(40);
      }
    }
    
    e.preventDefault(); // Prevent scrolling
  };

  const handleTouchEnd = (e?: React.TouchEvent) => {
    if (!isDragging) return;
    
    const diffX = currentX.current - startX.current;
    const threshold = 80; // Minimum swipe distance
    const commitThreshold = 120; // Strong commit threshold
    
    // Success haptic feedback for commits
    if (Math.abs(diffX) > commitThreshold) {
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]); // Success pattern
      }
    }
    
    if (diffX > threshold) {
      // Swipe right - Accept
      onAccept(request.id);
    } else if (diffX < -threshold) {
      // Swipe left - Decline  
      onDecline(request.id);
    } else {
      // Not enough swipe distance, spring back with light haptic
      if (navigator.vibrate && Math.abs(diffX) > 20) {
        navigator.vibrate(20); // Light bounce feedback
      }
    }
    
    // Reset with smooth animation
    setSwipeOffset(0);
    setIsDragging(false);
    
    if (e) {
      e.preventDefault();
    }
  };

  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsDragging(true);
    e.preventDefault();
    
    // Add global mouse event listeners for better desktop experience
    const handleGlobalMouseMove = (globalE: MouseEvent) => {
      if (!isDragging) return;
      
      currentX.current = globalE.clientX;
      const diffX = currentX.current - startX.current;
      
      // Same logic as touch with resistance
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
    };
    
    const handleGlobalMouseUp = () => {
      handleMouseUp();
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // This is now handled by global listeners for better experience
    return;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diffX = currentX.current - startX.current;
    const threshold = 80; // Minimum swipe distance
    
    if (diffX > threshold) {
      // Swipe right - Accept
      onAccept(request.id);
    } else if (diffX < -threshold) {
      // Swipe left - Decline  
      onDecline(request.id);
    }
    
    // Reset with smooth spring-back animation
    setSwipeOffset(0);
    setIsDragging(false);
  };

  // Add mouse leave handler to reset state
  const handleMouseLeave = () => {
    if (isDragging) {
      setSwipeOffset(0);
      setIsDragging(false);
    }
  };

  const progressPercentage = (timeLeft / 26) * 100;

  // Calculate pickup distance (mock - in real app would use GPS)
  const pickupDistance = (Math.random() * 3 + 0.5).toFixed(1); // 0.5-3.5 miles

  // Visual feedback for swipe direction with enhanced thresholds
  const getSwipeBackground = () => {
    const lightThreshold = 40;
    const mediumThreshold = 80;
    const strongThreshold = 120;
    
    if (swipeOffset > strongThreshold) {
      return 'bg-green-200 border-green-400 shadow-green-200 shadow-lg';
    } else if (swipeOffset > mediumThreshold) {
      return 'bg-green-150 border-green-350';
    } else if (swipeOffset > lightThreshold) {
      return 'bg-green-50 border-green-200';
    } else if (swipeOffset < -strongThreshold) {
      return 'bg-red-200 border-red-400 shadow-red-200 shadow-lg';
    } else if (swipeOffset < -mediumThreshold) {
      return 'bg-red-150 border-red-350';
    } else if (swipeOffset < -lightThreshold) {
      return 'bg-red-50 border-red-200';
    }
    return 'bg-white border-gray-200';
  };

  const getSwipeIndicator = () => {
    const mediumThreshold = 80;
    const strongThreshold = 120;
    
    if (swipeOffset > mediumThreshold) {
      const opacity = Math.min(1, (Math.abs(swipeOffset) - mediumThreshold) / 40);
      const isStrong = swipeOffset > strongThreshold;
      
      return (
        <div 
          className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-all duration-100 ${
            isStrong ? 'text-green-700' : 'text-green-600'
          }`}
          style={{ opacity }}
        >
          <HandSwipeRight size={isStrong ? 28 : 24} weight="bold" />
          <span className={`font-bold ${isStrong ? 'text-lg' : 'text-base'}`}>
            {isStrong ? 'ACCEPT!' : 'Accept'}
          </span>
        </div>
      );
    } else if (swipeOffset < -mediumThreshold) {
      const opacity = Math.min(1, (Math.abs(swipeOffset) - mediumThreshold) / 40);
      const isStrong = swipeOffset < -strongThreshold;
      
      return (
        <div 
          className={`absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-all duration-100 ${
            isStrong ? 'text-red-700' : 'text-red-600'
          }`}
          style={{ opacity }}
        >
          <HandSwipeLeft size={isStrong ? 28 : 24} weight="bold" />
          <span className={`font-bold ${isStrong ? 'text-lg' : 'text-base'}`}>
            {isStrong ? 'DECLINE!' : 'Decline'}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full max-w-sm mx-auto px-3">
      {/* Swipe instruction overlay - compact */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-3 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg">
          <div className="flex items-center gap-1.5">
            <HandSwipeLeft size={16} />
            <span>Decline</span>
          </div>
          <div className="w-px h-4 bg-white/30" />
          <div className="flex items-center gap-1.5">
            <HandSwipeRight size={16} />
            <span>Accept</span>
          </div>
        </div>
      </div>

      <Card 
        ref={cardRef}
        className={`w-full shadow-2xl border-2 animate-fade-in-scale transition-all duration-200 relative overflow-hidden no-select ${getSwipeBackground()}`}
        style={{
          transform: `translateX(${swipeOffset}px) ${isDragging ? 'scale(1.02)' : 'scale(1)'}`,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'transform 0.1s ease-out' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Swipe indicator */}
        {getSwipeIndicator()}
        
        {/* Minimal Header with Timer - Better Spacing */}
        <CardHeader className="pb-3 pt-6 px-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">New Ride Request</h3>
            <div className="flex items-center gap-2 bg-orange-100 px-3 py-2 rounded-full">
              <Timer size={14} className="text-orange-600" />
              <span className="text-orange-700 font-bold text-sm">{timeLeft}s</span>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </CardHeader>
        
        <CardContent className="px-6 pb-6 space-y-6">
          {/* BIG EARNINGS DISPLAY - Most Important */}
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-green-600 mb-2">
              £{request.estimatedFare.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 font-medium">You earn</div>
          </div>

          {/* KEY METRICS - Properly Spaced */}
          <div className="space-y-3">
            {/* Customer Rating */}
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-lg">👤</span>
              <span className="text-base font-bold text-gray-900">{request.passenger.rating.toFixed(1)}★</span>
              <span className="text-sm text-gray-600">Customer Rating</span>
            </div>

            {/* TWO KEY TIMELINES - What Drivers Need */}
            <div className="grid grid-cols-2 gap-3">
              {/* Time/Distance to Pickup */}
              <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">📍</span>
                  <span className="text-xs text-blue-700 font-medium uppercase tracking-wide">To Pickup</span>
                </div>
                <div className="text-lg font-bold text-blue-900">{pickupDistance}mi</div>
                <div className="text-sm text-blue-700">{Math.ceil(parseFloat(pickupDistance) * 2.5)} min drive</div>
              </div>

              {/* Trip Duration/Distance */}
              <div className="px-4 py-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🚗</span>
                  <span className="text-xs text-purple-700 font-medium uppercase tracking-wide">Trip Length</span>
                </div>
                <div className="text-lg font-bold text-purple-900">{request.estimatedDistance.toFixed(1)}mi</div>
                <div className="text-sm text-purple-700">{request.estimatedDuration} min journey</div>
              </div>
            </div>
          </div>

          {/* FULL LOCATION NAMES - No Truncation */}
          <div className="space-y-3">
            <div className="px-4 py-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📍</span>
                <span className="text-xs text-green-700 font-medium uppercase tracking-wide">Pickup Location</span>
              </div>
              <div className="text-sm font-semibold text-green-900 leading-relaxed">
                {request.pickup.address}
              </div>
            </div>

            <div className="px-4 py-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎯</span>
                <span className="text-xs text-orange-700 font-medium uppercase tracking-wide">Destination</span>
              </div>
              <div className="text-sm font-semibold text-orange-900 leading-relaxed">
                {request.destination.address}
              </div>
            </div>
          </div>

          {/* Large Action Buttons - Better Spacing */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onDecline(request.id)}
              className="h-12 border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-bold text-base"
              disabled={isDragging}
            >
              Decline
            </Button>
            <Button 
              onClick={() => onAccept(request.id)}
              className="h-12 bg-green-600 hover:bg-green-700 text-white font-bold text-base shadow-md"
              disabled={isDragging}
            >
              Accept ✅
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}