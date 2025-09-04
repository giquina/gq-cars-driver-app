import { useState, useEffect } from "react";
import { RideRequest } from "@/types/index";
  Clock, 
  MapPin,
  Phone,
} from "
interface
  onAccept: (r
}
exp


      return;

      setTimeLeft(prev => prev - 1);

 

    e.preventDefault();
  };

    e.stopPropagati

    <div 
      onTouch
     

        className="bg-white rounded-2
        onWheel={handleWheel}
          tou

      >
        <div className="px-4 py-3 border

          
              </span>
            <button 
              className="p-1 hover:bg-gray-100 rounded-full"
              <X size={14} classN
          </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-g
              </span>
            <div clas
            </div>
                <spa
                </span>
            </div>
             
              className="h-7 w-7 p-0"
              <Phone 
          </div>
          {/* 

              <div className
                <p className="text-xs t
              </div>

            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gra
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
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CurrencyGbp size={16} className="text-green-600" />
                <span className="font-bold text-lg text-gray-900">
                  £{request.estimatedFare.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {request.estimatedDistance.toFixed(1)}mi • {request.estimatedDuration}min
                </p>
                <p className="text-xs text-gray-500">{request.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Special requests */}
          {request.specialRequests && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-800">{request.specialRequests}</p>
            </div>
          )}
        </div>


        <div className="px-6 pb-6">

            <Button 

              variant="outline" 

            >

            </Button>

              onClick={() => onAccept(request.id)}
              className="flex-1 h-12 bg-green-600 hover:bg-green-700 font-semibold"
            >

            </Button>

        </div>

    </div>

}