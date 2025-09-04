import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Driver } from "@/types";
import { Circle, Car, DollarSign, Star, TrendUp } from "@phosphor-icons/react";

interface DriverStatusProps {
  driver: Driver;
  onToggleOnline: () => void;
}

export function DriverStatus({ driver, onToggleOnline }: DriverStatusProps) {
  return (
    <Card className="mb-6 bg-gradient-to-br from-card via-card/95 to-muted/20 border-2 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <Car size={28} className="text-primary-foreground" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white shadow-sm ${
                driver.isOnline ? 'bg-success' : 'bg-muted-foreground'
              }`}>
                {driver.isOnline && (
                  <div className="absolute inset-0 bg-success rounded-full animate-ping opacity-75" />
                )}
              </div>
            </div>
            <div>
              <h2 className="font-bold text-xl">{driver.name}</h2>
              <p className="text-sm text-muted-foreground font-medium">{driver.vehicleModel}</p>
              <p className="text-xs text-muted-foreground">{driver.vehiclePlate}</p>
            </div>
          </div>
          <Badge 
            variant={driver.isOnline ? "default" : "secondary"} 
            className={`flex items-center gap-2 px-3 py-1 text-sm font-semibold ${
              driver.isOnline 
                ? 'bg-success text-success-foreground shadow-lg animate-pulse-once' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Circle size={8} weight="fill" />
            {driver.isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border">
            <div className="flex items-center justify-center mb-1">
              <DollarSign size={16} className="text-success mr-1" />
              <div className="text-2xl font-bold text-success">${driver.earnings.today.toFixed(2)}</div>
            </div>
            <div className="text-xs text-muted-foreground font-medium">Today's Earnings</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border">
            <div className="flex items-center justify-center mb-1">
              <TrendUp size={16} className="text-primary mr-1" />
              <div className="text-2xl font-bold text-primary">{driver.trips.completed}</div>
            </div>
            <div className="text-xs text-muted-foreground font-medium">Completed Trips</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-yellow-500/10 to-yellow-400/5 rounded-xl border">
            <div className="flex items-center justify-center mb-1">
              <Star size={16} className="text-yellow-600 mr-1" weight="fill" />
              <div className="text-2xl font-bold text-yellow-600">{driver.rating.toFixed(1)}</div>
            </div>
            <div className="text-xs text-muted-foreground font-medium">Driver Rating</div>
          </div>
        </div>

        <Button 
          onClick={onToggleOnline}
          className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
            driver.isOnline 
              ? 'bg-destructive hover:bg-destructive/90 shadow-lg hover:shadow-xl' 
              : 'bg-gradient-to-r from-success to-accent hover:from-success/90 hover:to-accent/90 shadow-lg hover:shadow-xl'
          }`}
          size="lg"
        >
          {driver.isOnline ? 'Go Offline' : 'Go Online'}
        </Button>
      </CardContent>
    </Card>
  );
}