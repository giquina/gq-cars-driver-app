import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Driver } from "@/types";
import { Circle, Car, DollarSign } from "@phosphor-icons/react";

interface DriverStatusProps {
  driver: Driver;
  onToggleOnline: () => void;
}

export function DriverStatus({ driver, onToggleOnline }: DriverStatusProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Car size={24} className="text-primary" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                driver.isOnline ? 'bg-success' : 'bg-muted-foreground'
              }`} />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{driver.name}</h2>
              <p className="text-sm text-muted-foreground">{driver.vehicleModel} • {driver.vehiclePlate}</p>
            </div>
          </div>
          <Badge variant={driver.isOnline ? "default" : "secondary"} className="flex items-center gap-1">
            <Circle size={8} weight="fill" />
            {driver.isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">${driver.earnings.today.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{driver.trips.completed}</div>
            <div className="text-xs text-muted-foreground">Trips</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{driver.rating.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
        </div>

        <Button 
          onClick={onToggleOnline}
          className={`w-full ${driver.isOnline ? 'bg-destructive hover:bg-destructive/90' : 'bg-accent hover:bg-accent/90'}`}
          size="lg"
        >
          {driver.isOnline ? 'Go Offline' : 'Go Online'}
        </Button>
      </CardContent>
    </Card>
  );
}