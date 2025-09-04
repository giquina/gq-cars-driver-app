import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, HandSwipeLeft, HandSwi

import { useState, useEffect, useRef } from "react";

interface FullScreenRideRequestProps {
  request: RideRequest;

  const [timeLeft, setTimeLeft] = useStat
 


    const timer = setInterval(() => {
        if (prev <= 1) {
          return 0;
        return prev - 1;
    }, 1000);
    return () => clearInterva

  const handleTouch
    setIsDragging(true);
  };
  const handleTouchMove 
    
    const diffX = c
    // Li
    const resistance = 0
    
      const e

      clampedDiff = diffX;
    

    const threshold = 80;
    
      if (navigator.vibrate) {
      }
      if (navigator.vib
    

  };
  const handleTouchEnd = (e?
    
    const threshold = 80;
    
    
      }
    
      onAccept(request.id);
      onDecline(requ
    
      }
    
    setIsDragging(false);
    if (e) {
    }

  con
  //
    const lightThreshold = 40;

    if (swipeOffset > 
    } else if (swipeOffse
    } else if (swipeOffset > lig
    
    } else if (swipeOffset < -mediumThreshold) {
    } else if (swipeOffset < -
    }
  };
  const getSwipeIndicator = () => {
    const strongThreshold = 12
    if (swipeOffset > mediumTh
      c
     
    
          } z-50`}
    

          </span>
      );
    
      
        <div 
            isStrong ? 'text-red
    
          <HandSwipeLeft size={isStrong ? 32
            {isStrong ? 'DECLI
        </div>
    }
  };
  re
      ref={screenRef}
      style={{
        transition: isDragging ? 'tr
      onTouchStart={handleTo
      onTouc
      {/* Swipe indicator */}

      <
     
    
          <div classNa
            <HandSwipeRig
    
      </div>
      {/* Header Section 
     
    

        </div>
      </div>

        
        <div className="text-center 
            £{request.estimate
          <div className="text-

    
            <div className="flex items-c
              <span className="text-xl font-b
            <div className="flex items-center g
              <span className="text-xl font-
            <div className="flex items-center 
              <span className="text-xl font-
            <div className="flex items-center ga
              <span className="text-xl fo
          </div>

        <div className="grid grid-cols-2 gap-6"
          <div className="bg-blue-50 rou
     

    

        </div>
        {/* Route Information *
          <div className="text-g
    
              <div>
                <div className="text-lg font-semibold text-gray-900 leading-tight"
                </div>
      
              
             
                  {request.destination.address}
              </div>
          </div>
      </div>
      {/*
        <div className="grid grid-cols-2 gap-6">
            variant="outline" 
            className="h-16 text-xl border-2 
            size=
            De
        
            className="h-16 text-xl bg-green-600
            size="lg"
            Accept ✅
      
    </div>
}



























































































































































