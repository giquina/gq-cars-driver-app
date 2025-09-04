import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
  Star, 
  Star, 
  MapPin,
  CurrencyGbp
impo
interfac
  onAccep
}
export functi
  const [isDragging, setIsDragg
  const [swipeDirection, setSwipeDirec

  useEffect(() => {
      onDecline(request
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


    if (dragPosition > 100) {
    } else if (dragPosition < -100) 
    } else {

    }


  return (
      {/* Main container
        bg-white rounded-2xl shadow-2xl bo
        ${swipeDirection === 'accept' ? 'bg-green-150 bor
    

        onTouchEnd={handleTouchEnd}
        {/* Header with time
    
              <Clock size={14} className="
            <span className="font-semibold tex
    
              <div 
    
            </div>
          </div>

        <div className="flex-1 
          <div className="flex item
            
              </span>
     
    

                </div>
              <p classNam
    
            </Button>

          <div className="flex items-
              <div className
            
              <div className
            </div>

     
    

                <p className="font-medium text-gray-
            </div>

          
                <p className="text-xs text-gray-600">Destination</p>
              </div>
          </div>
          {/* Fare info */}
            <div className="flex items-center justify
                <CurrencyGbp size={16} className="text-green-600" />
              </div>
                <div classNa
        
                  {request.estimatedDis
              </div>
          </div>
       
            <div className="bg-bl
            </div>
        </div>
        {/* Swipe to respond */}
          <div className={`
            ${swip
              'border-gray-200'}
            {/* 
              <div className="flex items-center gap
                <span className="text-sm">Swipe right to accept</span>
            </div>
            {/* Background hints */}
              <Check size={16} />
            </di
              <spa
            </div>
            {/* 
              

              `}
                transform: `translateX(${dragPosition}px)`
            >
                <Check size={20} className="text-green-6
                <X size={20} className="text-red-600" />
                <HandSwipeRight size={20} className="text-gray-4
            </div>

          <div cla
              variant="outline" 
              className="flex-1 h-10"
            >
              Decline
            <Button 
              className="flex-1 h-10 bg-green-600 hover:bg-green-700"
            >
              Accept
          </div>
      </div>
  );






































































































































