import { useState } from "react";
import { MapPin, Navigation } from "@phosphor-icons/react";

interface Location {
  lat: number;
  lng: number;
}

interface BackgroundMapProps {
  currentLocation: Location;
  className?: string;
}

export function BackgroundMap({ currentLocation, className = "" }: BackgroundMapProps) {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  // Generate a mock street pattern around the current location
  const generateStreetPattern = () => {
    const streets = [];
    const baseX = 50; // Center of SVG viewBox
    const baseY = 50;
    
    // Generate random street-like patterns
    for (let i = 0; i < 8; i++) {
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const endX = Math.random() * 100;
      const endY = Math.random() * 100;
      
      streets.push(
        <path
          key={i}
          d={`M ${startX} ${startY} L ${endX} ${endY}`}
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="0.5"
          opacity="0.3"
        />
      );
    }
    
    return streets;
  };

  return (
    <div className={`relative w-full h-full bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 ${className}`}>
      {/* Mock Google Maps style background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Street pattern */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Background area */}
          <rect width="100" height="100" fill="hsl(var(--background))" opacity="0.1" />
          
          {/* Street grid pattern */}
          <defs>
            <pattern id="streetGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.2" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#streetGrid)" />
          
          {/* Mock streets */}
          {generateStreetPattern()}
          
          {/* Major roads */}
          <path d="M 0 30 Q 50 25 100 35" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.4" />
          <path d="M 20 0 Q 25 50 30 100" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.4" />
          <path d="M 70 0 Q 75 50 80 100" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.4" />
          
          {/* Points of interest */}
          <circle cx="25" cy="25" r="1.5" fill="hsl(var(--muted-foreground))" opacity="0.3" />
          <circle cx="75" cy="75" r="1.5" fill="hsl(var(--muted-foreground))" opacity="0.3" />
          <circle cx="80" cy="20" r="1.5" fill="hsl(var(--muted-foreground))" opacity="0.3" />
          
          {/* Current location - center of map */}
          <g>
            {/* GPS accuracy circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="8" 
              fill="rgb(59 130 246)" 
              opacity="0.2" 
              className="animate-pulse"
            />
            {/* Location dot */}
            <circle 
              cx="50" 
              cy="50" 
              r="2" 
              fill="rgb(59 130 246)" 
              className="animate-pulse"
            />
            {/* Pulsing ring */}
            <circle 
              cx="50" 
              cy="50" 
              r="4" 
              fill="none" 
              stroke="rgb(59 130 246)" 
              strokeWidth="1" 
              opacity="0.6" 
              className="animate-ping"
            />
          </g>
        </svg>
      </div>

      {/* Map UI Elements */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Location info */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="font-medium text-foreground">GPS Active</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Bottom-left controls */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <MapPin size={12} className="text-blue-500" />
            <span className="font-medium text-foreground">Current Location</span>
          </div>
        </div>
      </div>

      {/* Map type toggle */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm text-xs font-medium hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          {mapType === 'roadmap' ? 'Satellite' : 'Map'}
        </button>
      </div>
    </div>
  );
}