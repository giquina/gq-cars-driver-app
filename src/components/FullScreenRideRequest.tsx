import { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";

  request: RideRequest;


  const [timeLeft, setT
  const [dragPosition, setDragPosition] 
  const startX = useRef(0);
 

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
  const handl
    }

    const timer = setInterval(() => {
  const handleTouchMove = (e: React.
    }, 1000);
    
      }
  };

    
    const threshold = 100;
    if (Math.abs(dragPos
        onAccept(request.id);
        onDecline(request.id)
    

    }

  co

    <div className="fixed inset-0 bg-white 
    
        <div className="flex items-center g
          <span className="
      </div>
    
        <Progress 
          className="h-1"
      </div>
      
        {/* Passenger info */}
          <div className="w-20 h-20 b
              {request.passenger.name.charAt(0)}
          </di
            {request.passenger.n
       
     
    

            <div className="flex
              <span>{requ
    

        <div className="bg
    
              <div className="w-3 h-3 bg-gree
                <p className=
              </div>
            
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
            </span>
        </div>
        {/* Special requests */}
          <div className="bg-blue-50 border border-blue-2
              <strong>Note:</strong> {request.specialRequests}
          </di
      </div>

        <div 
            swipeDirection === 'a
            'borde
          onTouchStart={handleTouchStart
          onTouchEnd={han
          
          on

            <div className
              <span>Swipe left to decline</span>
            <div className="fl
              <HandSwipeRight size={16} cl
          </div>
          {/* Swipeable element */}
            className={`w-16 h-16 rounded-full f
              swipe
            }`}
              transform: `translateX(${dragPosition}px)`,
          >
             sw
          </div>
          {/* Background hints */}
            <div className={`transition-opacity duration-200 ${swipeDirect
            </div>
              <spa
          </div>

        <div className="fl
            onClick={() => onDecline(request.id)}
          >
          </button>
            onClic
          >
          </bu

  );



































































































































