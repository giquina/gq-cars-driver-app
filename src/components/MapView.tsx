import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation, Map } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface MapViewProps {
  pickup: Location;
  destination: Location;
  currentStatus: 'going_to_pickup' | 'arrived_at_pickup' | 'passenger_on_board';
  onNavigate: () => void;
}

export function MapView({ pickup, destination, currentStatus, onNavigate }: MapViewProps) {
  // Simple visual representation of the route
  const renderRoute = () => {
    const isGoingToPickup = currentStatus === 'going_to_pickup' || currentStatus === 'arrived_at_pickup';
    
    return (
      <div className="relative h-48 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center">
        {/* Mock map visualization */}
        <div className="absolute inset-0 p-4">
          <div className="relative h-full w-full">
            {/* Current location indicator */}
            <div className="absolute top-4 left-4">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <div className="text-xs text-primary font-medium mt-1">You</div>
            </div>
            
            {/* Pickup location */}
            <div className={`absolute ${isGoingToPickup ? 'top-4 right-4' : 'bottom-8 left-8'}`}>
              <div className={`w-3 h-3 ${isGoingToPickup ? 'bg-accent animate-pulse' : 'bg-muted-foreground'} rounded-full`}></div>
              <div className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
                {isGoingToPickup ? 'Pickup' : 'Pickup ✓'}
              </div>
            </div>
            
            {/* Destination */}
            <div className={`absolute bottom-4 right-4`}>
              <MapPin size={16} className={`${currentStatus === 'passenger_on_board' ? 'text-accent animate-pulse' : 'text-muted-foreground'}`} />
              <div className="text-xs text-muted-foreground mt-1">Destination</div>
            </div>
            
            {/* Route line visualization */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: 'var(--primary)', stopOpacity: 0.3}} />
                  <stop offset="100%" style={{stopColor: 'var(--accent)', stopOpacity: 0.3}} />
                </linearGradient>
              </defs>
              
              {/* Main route path */}
              <path
                d={isGoingToPickup 
                  ? "M 20 20 Q 50 40 80 20" 
                  : "M 20 80 Q 50 40 80 80"
                }
                stroke="url(#routeGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                className={isGoingToPickup || currentStatus === 'passenger_on_board' ? 'animate-pulse' : ''}
              />
            </svg>
          </div>
        </div>
        
        {/* Center navigation button */}
        <Button 
          onClick={onNavigate}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          <Navigation size={20} className="mr-2" />
          Navigate
        </Button>
      </div>
    );
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Map size={20} className="text-primary" />
          <h3 className="font-semibold">Route Overview</h3>
        </div>
        
        {renderRoute()}
        
        {/* Location details */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-accent mt-1.5"></div>
            <div className="flex-1">
              <div className="text-muted-foreground">Pickup</div>
              <div className="font-medium">{pickup.address}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={12} className="text-destructive mt-1" />
            <div className="flex-1">
              <div className="text-muted-foreground">Destination</div>
              <div className="font-medium">{destination.address}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}