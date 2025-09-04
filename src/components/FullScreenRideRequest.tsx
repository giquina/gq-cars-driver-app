import { useState, useEffect } from "react";
import { RideRequest } from "@/types/index";
import { RideRequest } from "@/types/index";
  Phone,
  Clock, 
} from "@
  Phone,
  on
  Star,
  CurrencyGbp
} from "@phosphor-icons/react";

interface FullScreenRideRequestProps {
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
 

  const handleTouchMove = (e: React.TouchEvent) => {
  };

  };
  return (
      className="fixed inse
      onWheel={handleWhe
        touchAction: 'none',
      }}
      <di
        onTouchMove={han
        s
          ove

        <div className="px-4 py-3 bord
            <Clock size={16} c

          </div>
  const handleTouchMove = (e: React.TouchEvent) => {
          >
  };

        <div className="p-4 space-y-3">
          <div classNam
  };

  return (
         
                <span className="text-sm text-gray-600">
                </span>
            </div>
              
        touchAction: 'none',
              <Phone size={14} />
      }}
     
           
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0" />
                <p className="text-xs
              </div>

            <div className="fl
              <div className="flex-1
          
       

        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-red-500" />
            <span className="text-sm font-semibold text-gray-900">
              New Request - {timeLeft}s
            </span>
          </div>
          <button 
            onClick={() => onDecline(request.id)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Passenger info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">
                {request.passenger.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{request.passenger.name}</h3>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">
                  {request.passenger.rating.toFixed(1)} • {request.passenger.tripCount} trips
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Phone size={14} />
            </Button>
          </div>

          {/* Route info */}
          <div className="space-y-3">
            {/* Pickup */}
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 uppercase tracking-wide">Pickup</p>
                <p className="font-medium text-gray-900 text-sm">{request.pickup.address}</p>
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 uppercase tracking-wide">Destination</p>
                <p className="font-medium text-gray-900 text-sm">{request.destination.address}</p>
              </div>
            </div>
          </div>

          {/* Trip details */}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CurrencyGbp size={16} className="text-green-600" />
                <span className="font-bold text-lg text-gray-900">
                  £{request.estimatedFare.toFixed(2)}

              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {request.estimatedDistance.toFixed(1)}mi • {request.estimatedDuration}min
                </p>
                <p className="text-xs text-gray-500">{request.paymentMethod}</p>
              </div>

          </div>

          {/* Special requests */}

            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-800">{request.specialRequests}</p>
            </div>

        </div>

        {/* Action buttons */}
        <div className="px-4 pb-4">
          <div className="flex gap-3">
            <Button 
              onClick={() => onDecline(request.id)}
              variant="outline" 
              className="flex-1 h-12 font-semibold"

              Decline

            <Button 

              className="flex-1 h-12 bg-green-600 hover:bg-green-700 font-semibold"

              Accept

          </div>

      </div>

  );
