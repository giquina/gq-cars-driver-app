import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Phone, 
  HandSwip
  X,
} from "@
interface
  onAccept: (r
}
export function F
  co
  const


      onDecline(request.id);
    }
    const timer = setInterval(() => {
    }, 1000);
 

    setIsDragging(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    
    const dragPos = currentX - startX.current;
    

    } else if (dragPos 
    } else {
    }

    setIsDrag
    c

      } else {
      }
      // Snap
    
  };
  // Calculate distance to pickup

  return (
      {/* Header with ti
        <div className="flex items-center 
    

        </div>
          value={(timeLeft /
    
      
      <div className="flex-1 px-4 py-6 overflo
        <div className="flex 
    
            </span>
          <div classNam
            <div className="flex i
              <span className="
              <span className="text
            
              <span className=
     


            {/* Pickup */}
              <div classN
    
                <p classNa
            </div>
            {/* Destination *
              <div className=
              
                <p className="
       
            
        </div>
        {/* Fare info */}
          <div className="flex
     
    

          </div>
        </div>
        {/* Special requests */}

          
          </div>
      </div>
      {/* Swipe to respond */}
        <div 
            swipeDirection === 'accept' ? 'bg-green-150 border-gr
            'border-gray-200'
          onTouchStart={handleT
          onTouchEnd={handleTouchEnd}
          </div>
            <H
          </div>
            <span>Swipe right to accept<
          </div>
          
            
      
            style={{
            }}
            {swipeDirection ==
            ) : swipeDirection === 'decline' ? (
            ) : (
            )}
          
          <div clas
          </div>
            <Check size={24} class
        </div>
        {/* Fallback buttons */}
          <Button 
            size="lg" 
            onClick={() => onDecline(request.id)}
            <X size={18} className="mr-2" />
          </Button
            size="lg" 
            onClick={() => onAccept(request.id)}
            <Check size={18} className="mr-2" />
          </Button
      </div>
  );










































































          {/* Swipeable element */}




            }`}

              transform: `translateX(${dragPosition}px)`,

          >







          </div>

          {/* Background hints */}


          </div>











            onClick={() => onDecline(request.id)}
          >







          >






  );
