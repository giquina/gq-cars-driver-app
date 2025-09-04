import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Driver } from "@/types";
import { Circle, Car, CurrencyGbp, Star, TrendUp, Power, MapPin } from "@phosphor-icons/react";

interface DriverStatusProps {
  driver: Driver;
  onToggleOnline: () => void;
}

export function DriverStatus({ driver, onToggleOnline }: DriverStatusProps) {
  return (
    <div className="space-y-4">
      {/* Online/Offline Toggle - prominent */}
      <div className="text-center">
        <Button 
          onClick={onToggleOnline}
          className={`w-full h-16 text-lg font-bold rounded-2xl transition-all shadow-lg ${
            driver.isOnline 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <div className={`w-4 h-4 rounded-full ${driver.isOnline ? 'bg-white' : 'bg-white'}`}>
              {driver.isOnline && (
                <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
              )}
            </div>
            {driver.isOnline ? 'Go Offline' : 'Go Online'}
          </div>
        </Button>
        
        <div className="mt-2 text-center">
          <span className={`text-sm font-medium ${
            driver.isOnline ? 'text-green-600' : 'text-gray-500'
          }`}>
            {driver.isOnline ? 'You are online and ready for requests' : 'You are offline'}
          </span>
        </div>
      </div>

      {/* Vehicle Info Card */}
      <Card className="bg-card border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Car size={24} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{driver.vehicleModel}</h3>
              <p className="text-sm text-muted-foreground">{driver.vehiclePlate}</p>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-gray-500" />
                <span className="text-xs text-gray-500">Central London</span>
              </div>
            </div>
            <Badge 
              variant={driver.isOnline ? "default" : "secondary"} 
              className={`${
                driver.isOnline 
                  ? 'bg-green-100 text-green-700 border-green-200' 
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              {driver.isOnline ? 'ONLINE' : 'OFFLINE'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}