import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigation, NavigationInstruction } from "@/hooks/useNavigation";
import { GPSPosition } from "@/hooks/useGPS";
import { 
  Navigation, 
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  RotateCounterClockwise,
  MapPin,
  Clock,
  Route,
  Gauge,
  Volume2,
  VolumeX,
  ExternalLink,
  PhoneCall,
  Car
} from "@phosphor-icons/react";

interface RealTimeNavigationProps {
  destination?: GPSPosition;
  currentPosition?: GPSPosition;
  isActive?: boolean;
  onNavigationComplete?: () => void;
  showVoiceControls?: boolean;
  className?: string;
}

export function RealTimeNavigation({ 
  destination, 
  currentPosition,
  isActive = false,
  onNavigationComplete,
  showVoiceControls = true,
  className 
}: RealTimeNavigationProps) {
  const {
    navigationState,
    currentRoute,
    startNavigation,
    updateNavigation,
    stopNavigation,
    openExternalNavigation,
    formatDistance,
    formatDuration,
    getVoiceInstruction,
  } = useNavigation();

  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [lastSpokenInstruction, setLastSpokenInstruction] = useState<string>('');

  // Start navigation when destination and position are available
  useEffect(() => {
    if (isActive && destination && currentPosition && !navigationState.isNavigating) {
      startNavigation(destination, currentPosition);
    }
  }, [isActive, destination, currentPosition, navigationState.isNavigating]);

  // Update navigation when position changes
  useEffect(() => {
    if (navigationState.isNavigating && currentPosition) {
      updateNavigation(currentPosition);
    }
  }, [currentPosition, navigationState.isNavigating]);

  // Handle navigation completion
  useEffect(() => {
    if (!navigationState.isNavigating && isActive && onNavigationComplete) {
      onNavigationComplete();
    }
  }, [navigationState.isNavigating, isActive, onNavigationComplete]);

  // Voice navigation
  useEffect(() => {
    if (voiceEnabled && navigationState.currentInstruction) {
      const instruction = getVoiceInstruction(navigationState.currentInstruction);
      
      // Only speak if instruction has changed and distance is less than 500m
      if (
        instruction !== lastSpokenInstruction && 
        navigationState.currentInstruction.distance < 500 &&
        'speechSynthesis' in window
      ) {
        const utterance = new SpeechSynthesisUtterance(instruction);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
        setLastSpokenInstruction(instruction);
      }
    }
  }, [voiceEnabled, navigationState.currentInstruction, lastSpokenInstruction]);

  // Get maneuver icon
  const getManeuverIcon = (maneuver: NavigationInstruction['maneuver'], size = 20) => {
    switch (maneuver) {
      case 'turn-left':
        return <ArrowLeft size={size} />;
      case 'turn-right':
        return <ArrowRight size={size} />;
      case 'straight':
        return <ArrowUp size={size} />;
      case 'u-turn':
        return <RotateCounterClockwise size={size} />;
      case 'destination':
        return <MapPin size={size} />;
      default:
        return <Navigation size={size} />;
    }
  };

  // Handle stop navigation
  const handleStopNavigation = () => {
    stopNavigation();
    toast.info("Navigation stopped");
  };

  // Toggle voice navigation
  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) {
      toast.error("Voice navigation not supported on this device");
      return;
    }
    
    setVoiceEnabled(!voiceEnabled);
    toast.success(voiceEnabled ? "Voice navigation disabled" : "Voice navigation enabled");
  };

  // Open in external navigation app
  const handleOpenExternal = (app: 'google' | 'apple' | 'waze' = 'google') => {
    if (!destination) return;
    
    openExternalNavigation(destination, app);
    toast.info(`Opening in ${app === 'google' ? 'Google Maps' : app === 'apple' ? 'Apple Maps' : 'Waze'}`);
  };

  if (!isActive || !destination) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation size={20} className="text-primary" />
            Turn-by-Turn Navigation
          </CardTitle>
          
          <div className="flex items-center gap-1">
            {showVoiceControls && (
              <Button
                variant={voiceEnabled ? "default" : "outline"}
                size="sm"
                onClick={handleToggleVoice}
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenExternal('google')}
            >
              <ExternalLink size={16} />
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleStopNavigation}
            >
              Stop
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Instruction */}
        {navigationState.currentInstruction && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                {getManeuverIcon(navigationState.currentInstruction.maneuver, 24)}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">
                  {navigationState.currentInstruction.instruction}
                </div>
                <div className="text-sm text-muted-foreground">
                  in {formatDistance(navigationState.currentInstruction.distance)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Instruction Preview */}
        {navigationState.nextInstruction && (
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Then:</span>
              {getManeuverIcon(navigationState.nextInstruction.maneuver, 16)}
              <span>{navigationState.nextInstruction.instruction}</span>
            </div>
          </div>
        )}

        {/* Route Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(navigationState.routeProgress * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${navigationState.routeProgress * 100}%` }}
            />
          </div>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Route size={14} />
              Distance Remaining
            </div>
            <div className="font-semibold">
              {formatDistance(navigationState.distanceToDestination)}
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Clock size={14} />
              Time Remaining
            </div>
            <div className="font-semibold">
              {formatDuration(navigationState.estimatedTimeRemaining)}
            </div>
          </div>
        </div>

        {/* Route Information */}
        {currentRoute && (
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Route Details</span>
              <Badge variant={
                currentRoute.trafficLevel === 'low' ? 'default' :
                currentRoute.trafficLevel === 'moderate' ? 'secondary' :
                currentRoute.trafficLevel === 'heavy' ? 'destructive' : 'destructive'
              }>
                {currentRoute.trafficLevel} traffic
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Total Distance</div>
                <div className="font-medium">{formatDistance(currentRoute.distance)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Total Time</div>
                <div className="font-medium">{formatDuration(currentRoute.duration)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">ETA</div>
                <div className="font-medium">
                  {currentRoute.estimatedArrival.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* External Navigation Options */}
        <div className="border-t pt-3">
          <div className="text-sm text-muted-foreground mb-2">Open in external app:</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenExternal('google')}
              className="flex-1"
            >
              Google Maps
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenExternal('apple')}
              className="flex-1"
            >
              Apple Maps
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenExternal('waze')}
              className="flex-1"
            >
              Waze
            </Button>
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="border-t pt-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Call passenger - would integrate with phone dialer
                toast.info("Calling passenger...");
              }}
              className="flex-1"
            >
              <PhoneCall size={16} className="mr-2" />
              Call Passenger
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Report issue - would open a modal or send to support
                toast.info("Reporting navigation issue...");
              }}
              className="flex-1"
            >
              <Car size={16} className="mr-2" />
              Report Issue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}