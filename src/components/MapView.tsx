import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Map, Crosshair, Route } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { GPSTracking } from "@/components/GPSTracking";
import { RealTimeNavigation } from "@/components/RealTimeNavigation";

interface GPSPosition {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

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
  showGPSTracking?: boolean;
  showRealTimeNavigation?: boolean;
}

export function MapView({ 
  pickup, 
  destination, 
  currentStatus, 
  onNavigate,
  showGPSTracking = true,
  showRealTimeNavigation = true 
}: MapViewProps) {
  const [currentGPSPosition, setCurrentGPSPosition] = useState<GPSPosition | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [view, setView] = useState<'map' | 'gps' | 'navigation'>('map');

  // Determine target destination based on trip status
  const targetDestination: GPSPosition = currentStatus === 'going_to_pickup' || currentStatus === 'arrived_at_pickup' 
    ? { lat: pickup.lat, lng: pickup.lng, accuracy: 0, timestamp: Date.now() }
    : { lat: destination.lat, lng: destination.lng, accuracy: 0, timestamp: Date.now() };

  // Handle GPS position updates
  const handleLocationUpdate = (position: GPSPosition) => {
    setCurrentGPSPosition(position);
  };

  // Handle navigation toggle
  const handleToggleNavigation = () => {
    if (isNavigating) {
      setIsNavigating(false);
      setView('map');
    } else {
      setIsNavigating(true);
      setView('navigation');
    }
  };

  // Handle navigation completion
  const handleNavigationComplete = () => {
    setIsNavigating(false);
    setView('map');
  };

  // Calculate distance between two points
  const calculateDistance = (pos1: { lat: number; lng: number }, pos2: { lat: number; lng: number }): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = pos1.lat * Math.PI / 180;
    const φ2 = pos2.lat * Math.PI / 180;
    const Δφ = (pos2.lat - pos1.lat) * Math.PI / 180;
    const Δλ = (pos2.lng - pos1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Get distance to target
  const getDistanceToTarget = (): string => {
    if (!currentGPSPosition) return 'N/A';
    
    const distance = calculateDistance(currentGPSPosition, targetDestination);
    
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  // Get GPS accuracy status
  const getGPSStatus = () => {
    if (!currentGPSPosition) return { color: 'bg-gray-500', text: 'No GPS' };
    
    const accuracy = currentGPSPosition.accuracy;
    if (accuracy <= 5) return { color: 'bg-green-500', text: 'Excellent GPS' };
    if (accuracy <= 10) return { color: 'bg-blue-500', text: 'Good GPS' };
    if (accuracy <= 20) return { color: 'bg-yellow-500', text: 'Fair GPS' };
    return { color: 'bg-red-500', text: 'Poor GPS' };
  };

  // Simple visual representation of the route
  const renderRoute = () => {
    const isGoingToPickup = currentStatus === 'going_to_pickup' || currentStatus === 'arrived_at_pickup';
    const gpsStatus = getGPSStatus();
    
    return (
      <div className="relative h-48 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center">
        {/* Mock map visualization */}
        <div className="absolute inset-0 p-4">
          <div className="relative h-full w-full">
            {/* Current GPS location indicator */}
            {currentGPSPosition && (
              <div className="absolute top-4 left-4">
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-500/20 rounded-full animate-ping"></div>
                </div>
                <div className="text-xs text-blue-600 font-medium mt-1 whitespace-nowrap">
                  You ({currentGPSPosition.accuracy.toFixed(0)}m)
                </div>
              </div>
            )}
            
            {/* Static current location indicator */}
            {!currentGPSPosition && (
              <div className="absolute top-4 left-4">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <div className="text-xs text-primary font-medium mt-1">You</div>
              </div>
            )}
            
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
        
        {/* Center navigation button with GPS status */}
        <div className="text-center">
          <Button 
            onClick={handleToggleNavigation}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg mb-2"
          >
            <Navigation size={20} className="mr-2" />
            {isNavigating ? 'Stop Navigation' : 'Start Navigation'}
          </Button>
          
          {/* GPS Status Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs">
              <div className={`w-2 h-2 rounded-full ${gpsStatus.color} mr-1`} />
              {gpsStatus.text}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  // View selector buttons
  const ViewSelector = () => (
    <div className="flex gap-1 mb-3">
      <Button
        variant={view === 'map' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setView('map')}
        className="flex-1"
      >
        <Map size={16} className="mr-1" />
        Map
      </Button>
      
      {showGPSTracking && (
        <Button
          variant={view === 'gps' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('gps')}
          className="flex-1"
        >
          <Crosshair size={16} className="mr-1" />
          GPS
        </Button>
      )}
      
      {showRealTimeNavigation && (
        <Button
          variant={view === 'navigation' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('navigation')}
          className="flex-1"
        >
          <Route size={16} className="mr-1" />
          Navigation
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Map size={20} className="text-primary" />
            <h3 className="font-semibold">Route & Navigation</h3>
            
            {/* Distance to target */}
            {currentGPSPosition && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {getDistanceToTarget()}
              </Badge>
            )}
          </div>
          
          <ViewSelector />
          
          {/* Render based on current view */}
          {view === 'map' && (
            <>
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

              {/* Quick actions */}
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={onNavigate}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Navigation size={16} className="mr-2" />
                  External Maps
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* GPS Tracking Component */}
      {view === 'gps' && showGPSTracking && (
        <GPSTracking
          onLocationUpdate={handleLocationUpdate}
          showDetailedInfo={true}
        />
      )}

      {/* Real-time Navigation Component */}
      {view === 'navigation' && showRealTimeNavigation && (
        <RealTimeNavigation
          destination={targetDestination}
          currentPosition={currentGPSPosition || undefined}
          isActive={view === 'navigation'}
          onNavigationComplete={handleNavigationComplete}
          showVoiceControls={true}
        />
      )}
    </div>
  );
}