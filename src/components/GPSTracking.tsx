import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useGPS, GPSPosition } from "@/hooks/useGPS";
import { 
  MapPin, 
  Crosshair, 
  Gauge, 
  Navigation2,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Route
} from "@phosphor-icons/react";

interface GPSTrackingProps {
  onLocationUpdate?: (position: GPSPosition) => void;
  showDetailedInfo?: boolean;
  className?: string;
}

export function GPSTracking({ onLocationUpdate, showDetailedInfo = true, className }: GPSTrackingProps) {
  const {
    currentPosition,
    positionHistory,
    permissionState,
    error,
    isLoading,
    isGeolocationAvailable,
    requestPermission,
    getCurrentPosition,
    startTracking,
    stopTracking,
    getTotalDistance,
    getCurrentSpeed,
    clearHistory,
  } = useGPS({
    enableHighAccuracy: true,
    trackSpeed: true,
    trackHeading: true,
  });

  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);

  // Handle location updates
  useEffect(() => {
    if (currentPosition && onLocationUpdate) {
      onLocationUpdate(currentPosition);
    }
  }, [currentPosition, onLocationUpdate]);

  // Handle tracking toggle
  const handleTrackingToggle = async (enabled: boolean) => {
    if (enabled) {
      if (permissionState.state !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          toast.error("Location permission is required for GPS tracking");
          return;
        }
      }

      const cleanup = await startTracking();
      if (cleanup) {
        setIsTrackingEnabled(true);
        setTrackingStartTime(new Date());
        toast.success("GPS tracking started");
      }
    } else {
      stopTracking();
      setIsTrackingEnabled(false);
      setTrackingStartTime(null);
      toast.info("GPS tracking stopped");
    }
  };

  // Get current location once
  const handleGetCurrentLocation = async () => {
    try {
      await getCurrentPosition();
      toast.success("Location updated");
    } catch (error) {
      toast.error("Failed to get current location");
    }
  };

  // Format speed for display
  const formatSpeed = (speedMs: number | null): string => {
    if (speedMs === null) return 'N/A';
    const speedKmh = speedMs * 3.6;
    return `${speedKmh.toFixed(1)} km/h`;
  };

  // Format distance for display
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${meters.toFixed(0)}m`;
    }
    return `${(meters / 1000).toFixed(2)}km`;
  };

  // Get accuracy status
  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy <= 5) return { status: 'excellent', color: 'bg-green-500', text: 'Excellent' };
    if (accuracy <= 10) return { status: 'good', color: 'bg-blue-500', text: 'Good' };
    if (accuracy <= 20) return { status: 'fair', color: 'bg-yellow-500', text: 'Fair' };
    return { status: 'poor', color: 'bg-red-500', text: 'Poor' };
  };

  // Get tracking duration
  const getTrackingDuration = (): string => {
    if (!trackingStartTime) return '0s';
    const now = new Date();
    const duration = Math.floor((now.getTime() - trackingStartTime.getTime()) / 1000);
    
    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Permission status component
  const PermissionStatus = () => {
    const getPermissionDisplay = () => {
      switch (permissionState.state) {
        case 'granted':
          return { icon: CheckCircle, color: 'text-green-500', text: 'Access Granted' };
        case 'denied':
          return { icon: XCircle, color: 'text-red-500', text: 'Access Denied' };
        default:
          return { icon: AlertTriangle, color: 'text-yellow-500', text: 'Permission Required' };
      }
    };

    const { icon: Icon, color, text } = getPermissionDisplay();

    return (
      <div className="flex items-center gap-2">
        <Icon size={16} className={color} />
        <span className={`text-sm ${color}`}>{text}</span>
      </div>
    );
  };

  // Position display component
  const PositionDisplay = () => {
    if (!currentPosition) return null;

    const accuracy = getAccuracyStatus(currentPosition.accuracy);

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            <span className="text-sm font-medium">Current Position</span>
          </div>
          <Badge variant="outline" className="text-xs">
            <div className={`w-2 h-2 rounded-full ${accuracy.color} mr-1`} />
            {accuracy.text}
          </Badge>
        </div>

        <div className="bg-muted/30 rounded-lg p-3 space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Latitude</div>
              <div className="font-mono">{currentPosition.lat.toFixed(6)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Longitude</div>
              <div className="font-mono">{currentPosition.lng.toFixed(6)}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Accuracy</div>
              <div>{currentPosition.accuracy.toFixed(1)}m</div>
            </div>
            <div>
              <div className="text-muted-foreground">Last Update</div>
              <div>{new Date(currentPosition.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>

          {(currentPosition.speed !== undefined || currentPosition.heading !== undefined) && (
            <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-border">
              {currentPosition.speed !== undefined && (
                <div>
                  <div className="text-muted-foreground">Speed</div>
                  <div className="flex items-center gap-1">
                    <Gauge size={12} />
                    {formatSpeed(currentPosition.speed)}
                  </div>
                </div>
              )}
              {currentPosition.heading !== undefined && (
                <div>
                  <div className="text-muted-foreground">Heading</div>
                  <div className="flex items-center gap-1">
                    <Navigation2 size={12} />
                    {currentPosition.heading.toFixed(0)}°
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tracking stats component
  const TrackingStats = () => {
    if (!isTrackingEnabled) return null;

    const totalDistance = getTotalDistance();
    const currentSpeed = getCurrentSpeed();

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-accent" />
          <span className="text-sm font-medium">Tracking Statistics</span>
        </div>

        <div className="bg-accent/5 rounded-lg p-3 space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Duration</div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                {getTrackingDuration()}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Points Recorded</div>
              <div>{positionHistory.length}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Distance Traveled</div>
              <div className="flex items-center gap-1">
                <Route size={12} />
                {formatDistance(totalDistance)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Current Speed</div>
              <div className="flex items-center gap-1">
                <Gauge size={12} />
                {formatSpeed(currentSpeed)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isGeolocationAvailable) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="text-center py-8">
            <XCircle size={48} className="mx-auto text-destructive mb-4" />
            <h3 className="font-semibold mb-2">GPS Not Available</h3>
            <p className="text-sm text-muted-foreground">
              Your device does not support GPS tracking
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Crosshair size={20} />
            GPS Tracking
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={isTrackingEnabled}
              onCheckedChange={handleTrackingToggle}
              disabled={isLoading}
            />
            <span className="text-sm text-muted-foreground">
              {isTrackingEnabled ? 'On' : 'Off'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <PermissionStatus />

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">GPS Error</span>
            </div>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
        )}

        {showDetailedInfo && <PositionDisplay />}
        
        {showDetailedInfo && <TrackingStats />}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetCurrentLocation}
            disabled={isLoading || permissionState.state === 'denied'}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Locating...
              </>
            ) : (
              <>
                <Crosshair size={16} className="mr-2" />
                Get Location
              </>
            )}
          </Button>

          {positionHistory.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="flex-1"
            >
              Clear History
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}