import { useState, useEffect } from 'react';
import { GPSPosition } from './useGPS';

export interface NavigationInstruction {
  id: string;
  instruction: string;
  distance: number;
  duration: number;
  maneuver: 'turn-left' | 'turn-right' | 'straight' | 'u-turn' | 'merge' | 'exit' | 'destination';
  streetName?: string;
}

export interface RouteInfo {
  distance: number; // in meters
  duration: number; // in seconds
  instructions: NavigationInstruction[];
  estimatedArrival: Date;
  trafficLevel: 'low' | 'moderate' | 'heavy' | 'severe';
}

export interface NavigationState {
  isNavigating: boolean;
  currentInstruction?: NavigationInstruction;
  nextInstruction?: NavigationInstruction;
  distanceToDestination: number;
  estimatedTimeRemaining: number;
  routeProgress: number; // 0-1
}

export function useNavigation() {
  const [destination, setDestination] = useState<GPSPosition | null>(null);
  const [currentRoute, setCurrentRoute] = useState<RouteInfo | null>(null);
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isNavigating: false,
    distanceToDestination: 0,
    estimatedTimeRemaining: 0,
    routeProgress: 0,
  });

  // Calculate route (mock implementation - in real app would use Google Maps/MapBox API)
  const calculateRoute = async (from: GPSPosition, to: GPSPosition): Promise<RouteInfo> => {
    // Mock route calculation
    const distance = calculateDistance(from, to);
    const baseSpeed = 30; // km/h average speed
    const duration = (distance / 1000) / baseSpeed * 3600; // convert to seconds

    // Generate mock instructions
    const instructions: NavigationInstruction[] = [
      {
        id: '1',
        instruction: 'Head north on current street',
        distance: distance * 0.3,
        duration: duration * 0.3,
        maneuver: 'straight',
      },
      {
        id: '2', 
        instruction: 'Turn right onto Main Street',
        distance: distance * 0.4,
        duration: duration * 0.4,
        maneuver: 'turn-right',
        streetName: 'Main Street',
      },
      {
        id: '3',
        instruction: 'Continue straight for 2.5 km',
        distance: distance * 0.2,
        duration: duration * 0.2,
        maneuver: 'straight',
      },
      {
        id: '4',
        instruction: 'Arrive at destination',
        distance: distance * 0.1,
        duration: duration * 0.1,
        maneuver: 'destination',
      },
    ];

    const route: RouteInfo = {
      distance,
      duration,
      instructions,
      estimatedArrival: new Date(Date.now() + duration * 1000),
      trafficLevel: Math.random() < 0.3 ? 'heavy' : Math.random() < 0.6 ? 'moderate' : 'low',
    };

    return route;
  };

  // Start navigation to destination
  const startNavigation = async (to: GPSPosition, from?: GPSPosition) => {
    if (!from) {
      throw new Error('Current position required to start navigation');
    }

    const route = await calculateRoute(from, to);
    setDestination(to);
    setCurrentRoute(route);
    setNavigationState({
      isNavigating: true,
      currentInstruction: route.instructions[0],
      nextInstruction: route.instructions[1],
      distanceToDestination: route.distance,
      estimatedTimeRemaining: route.duration,
      routeProgress: 0,
    });
  };

  // Update navigation based on current position
  const updateNavigation = (currentPosition: GPSPosition) => {
    if (!destination || !currentRoute || !navigationState.isNavigating) return;

    const distanceToDestination = calculateDistance(currentPosition, destination);
    const routeProgress = Math.max(0, 1 - (distanceToDestination / currentRoute.distance));
    
    // Find current instruction based on progress
    let currentInstructionIndex = 0;
    let progressSum = 0;
    for (let i = 0; i < currentRoute.instructions.length; i++) {
      const instructionProgress = currentRoute.instructions[i].distance / currentRoute.distance;
      if (routeProgress <= progressSum + instructionProgress) {
        currentInstructionIndex = i;
        break;
      }
      progressSum += instructionProgress;
    }

    const currentInstruction = currentRoute.instructions[currentInstructionIndex];
    const nextInstruction = currentRoute.instructions[currentInstructionIndex + 1];

    // Calculate estimated time remaining
    const averageSpeed = 30; // km/h
    const estimatedTimeRemaining = (distanceToDestination / 1000) / averageSpeed * 3600;

    setNavigationState({
      isNavigating: true,
      currentInstruction,
      nextInstruction,
      distanceToDestination,
      estimatedTimeRemaining,
      routeProgress,
    });

    // Check if arrived at destination (within 50 meters)
    if (distanceToDestination < 50) {
      stopNavigation();
    }
  };

  // Stop navigation
  const stopNavigation = () => {
    setNavigationState({
      isNavigating: false,
      distanceToDestination: 0,
      estimatedTimeRemaining: 0,
      routeProgress: 0,
    });
    setDestination(null);
    setCurrentRoute(null);
  };

  // Open external navigation app
  const openExternalNavigation = (destination: GPSPosition, app: 'google' | 'apple' | 'waze' = 'google') => {
    const { lat, lng } = destination;
    
    let url = '';
    switch (app) {
      case 'google':
        url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
        break;
      case 'apple':
        url = `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
        break;
      case 'waze':
        url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
        break;
    }

    // Try to open in app, fallback to web
    try {
      window.open(url, '_system');
    } catch (error) {
      window.open(url, '_blank');
    }
  };

  // Get turn-by-turn voice instruction
  const getVoiceInstruction = (instruction: NavigationInstruction): string => {
    const distance = formatDistance(instruction.distance);
    
    switch (instruction.maneuver) {
      case 'turn-left':
        return `In ${distance}, turn left${instruction.streetName ? ` onto ${instruction.streetName}` : ''}`;
      case 'turn-right':
        return `In ${distance}, turn right${instruction.streetName ? ` onto ${instruction.streetName}` : ''}`;
      case 'straight':
        return `Continue straight for ${distance}`;
      case 'u-turn':
        return `In ${distance}, make a U-turn`;
      case 'destination':
        return `In ${distance}, you will arrive at your destination`;
      default:
        return instruction.instruction;
    }
  };

  // Format distance for display
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  // Calculate distance between two GPS points
  const calculateDistance = (pos1: GPSPosition, pos2: GPSPosition): number => {
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

  return {
    // State
    destination,
    currentRoute,
    navigationState,

    // Actions
    startNavigation,
    updateNavigation,
    stopNavigation,
    openExternalNavigation,

    // Utilities
    calculateRoute,
    getVoiceInstruction,
    formatDistance,
    formatDuration,
    calculateDistance,
  };
}