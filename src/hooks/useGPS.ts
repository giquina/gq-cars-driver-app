import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';

export interface GPSPosition {
  lat: number;
  lng: number;
  accuracy: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface GPSTrackingOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  trackSpeed?: boolean;
  trackHeading?: boolean;
}

export interface LocationPermissionState {
  state: 'prompt' | 'granted' | 'denied';
  isTracking: boolean;
}

export function useGPS(options: GPSTrackingOptions = {}) {
  const [currentPosition, setCurrentPosition] = useKV<GPSPosition | null>('gps-current-position', null);
  const [positionHistory, setPositionHistory] = useKV<GPSPosition[]>('gps-position-history', []);
  const [permissionState, setPermissionState] = useState<LocationPermissionState>({
    state: 'prompt',
    isTracking: false
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const defaultOptions: PositionOptions = {
    enableHighAccuracy: options.enableHighAccuracy ?? true,
    maximumAge: options.maximumAge ?? 30000, // 30 seconds
    timeout: options.timeout ?? 15000, // 15 seconds
  };

  // Check geolocation API availability
  const isGeolocationAvailable = 'geolocation' in navigator;

  // Request location permission
  const requestPermission = async (): Promise<boolean> => {
    if (!isGeolocationAvailable) {
      setError('Geolocation is not supported by this browser');
      return false;
    }

    try {
      // Check if permissions API is available
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionState(prev => ({ ...prev, state: permission.state as any }));
        
        permission.addEventListener('change', () => {
          setPermissionState(prev => ({ ...prev, state: permission.state as any }));
        });
      }

      setIsLoading(true);
      setError(null);

      // Try to get current position to test permission
      await getCurrentPosition();
      
      setPermissionState(prev => ({ ...prev, state: 'granted' }));
      return true;
    } catch (err) {
      const error = err as GeolocationPositionError;
      handleLocationError(error);
      setPermissionState(prev => ({ ...prev, state: 'denied' }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get current position once
  const getCurrentPosition = (): Promise<GPSPosition> => {
    return new Promise((resolve, reject) => {
      if (!isGeolocationAvailable) {
        reject(new Error('Geolocation not available'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const gpsPosition: GPSPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: options.trackHeading ? position.coords.heading || undefined : undefined,
            speed: options.trackSpeed ? position.coords.speed || undefined : undefined,
            timestamp: position.timestamp,
          };

          setCurrentPosition(gpsPosition);
          resolve(gpsPosition);
        },
        (error) => {
          handleLocationError(error);
          reject(error);
        },
        defaultOptions
      );
    });
  };

  // Start continuous tracking
  const startTracking = async (): Promise<boolean> => {
    if (permissionState.state !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    if (!isGeolocationAvailable) {
      setError('Geolocation is not supported by this browser');
      return false;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const gpsPosition: GPSPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: options.trackHeading ? position.coords.heading || undefined : undefined,
          speed: options.trackSpeed ? position.coords.speed || undefined : undefined,
          timestamp: position.timestamp,
        };

        setCurrentPosition(gpsPosition);
        
        // Add to history (keep last 100 positions)
        setPositionHistory(currentHistory => {
          const newHistory = [gpsPosition, ...currentHistory];
          return newHistory.slice(0, 100);
        });

        setError(null);
      },
      (error) => {
        handleLocationError(error);
      },
      defaultOptions
    );

    setPermissionState(prev => ({ ...prev, isTracking: true }));

    // Return cleanup function
    return () => {
      navigator.geolocation.clearWatch(watchId);
      setPermissionState(prev => ({ ...prev, isTracking: false }));
    };
  };

  // Stop tracking
  const stopTracking = () => {
    setPermissionState(prev => ({ ...prev, isTracking: false }));
  };

  // Handle geolocation errors
  const handleLocationError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError('Location access denied by user');
        setPermissionState(prev => ({ ...prev, state: 'denied' }));
        break;
      case error.POSITION_UNAVAILABLE:
        setError('Location information is unavailable');
        break;
      case error.TIMEOUT:
        setError('Location request timed out');
        break;
      default:
        setError('An unknown error occurred while retrieving location');
        break;
    }
  };

  // Calculate distance between two points in meters
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

  // Calculate bearing between two points
  const calculateBearing = (pos1: GPSPosition, pos2: GPSPosition): number => {
    const φ1 = pos1.lat * Math.PI / 180;
    const φ2 = pos2.lat * Math.PI / 180;
    const Δλ = (pos2.lng - pos1.lng) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  // Get total distance traveled
  const getTotalDistance = (): number => {
    if (positionHistory.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 0; i < positionHistory.length - 1; i++) {
      totalDistance += calculateDistance(positionHistory[i + 1], positionHistory[i]);
    }
    return totalDistance;
  };

  // Get current speed (m/s)
  const getCurrentSpeed = (): number | null => {
    if (!currentPosition?.speed) return null;
    return currentPosition.speed;
  };

  // Clear position history
  const clearHistory = () => {
    setPositionHistory([]);
  };

  return {
    // State
    currentPosition,
    positionHistory,
    permissionState,
    error,
    isLoading,
    isGeolocationAvailable,

    // Actions
    requestPermission,
    getCurrentPosition,
    startTracking,
    stopTracking,
    clearHistory,

    // Utilities
    calculateDistance,
    calculateBearing,
    getTotalDistance,
    getCurrentSpeed,
  };
}