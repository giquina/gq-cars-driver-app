import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Driver } from "@/types";
import { Circle, Car, CurrencyGbp, Star, TrendUp, Power } from "@phosphor-icons/react";

interface DriverStatusProps {
  driver: Driver;
  onToggleOnline: () => void;
}

export function DriverStatus({ driver, onToggleOnline }: DriverStatusProps) {
  return (
    <Card className="mb-1.5 bg-card border">
      <CardContent className="p-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Car size={14} className="text-primary-foreground" />
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
                driver.isOnline ? 'bg-success' : 'bg-muted-foreground'
              }`}>
                {driver.isOnline && (
                  <div className="absolute inset-0 bg-success rounded-full animate-ping opacity-75" />
                )}
              </div>
            </div>
            <div>
              <h2 className="font-bold text-xs text-foreground">{driver.name}</h2>
              <p className="text-[9px] text-muted-foreground">{driver.vehicleModel}</p>
              <p className="text-[8px] text-muted-foreground bg-muted px-1 py-0.5 rounded inline-block">{driver.vehiclePlate}</p>
            </div>
          </div>
          <Badge 
            variant={driver.isOnline ? "default" : "secondary"} 
            className={`flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold rounded-full ${
              driver.isOnline 
                ? 'bg-success text-success-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Circle size={3} weight="fill" />
            {driver.isOnline ? 'ONLINE' : 'OFFLINE'}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-1 mb-1.5">
          <div className="text-center p-1 bg-success/10 rounded border border-success/20">
            <div className="flex items-center justify-center mb-0.5">
              <CurrencyGbp size={8} className="text-success mr-0.5" />
              <div className="text-[10px] font-bold text-success">£{driver.earnings.today.toFixed(2)}</div>
            </div>
            <div className="text-[7px] text-muted-foreground">Today</div>
          </div>
          <div className="text-center p-1 bg-primary/10 rounded border border-primary/20">
            <div className="flex items-center justify-center mb-0.5">
              <TrendUp size={8} className="text-primary mr-0.5" />
              <div className="text-[10px] font-bold text-primary">{driver.trips.completed}</div>
            </div>
            <div className="text-[7px] text-muted-foreground">Trips</div>
          </div>
          <div className="text-center p-1 bg-yellow-500/10 rounded border border-yellow-400/20">
            <div className="flex items-center justify-center mb-0.5">
              <Star size={8} className="text-yellow-600 mr-0.5" weight="fill" />
              <div className="text-[10px] font-bold text-yellow-600">{driver.rating.toFixed(1)}</div>
            </div>
            <div className="text-[7px] text-muted-foreground">Rating</div>
          </div>
        </div>

        <Button 
          onClick={onToggleOnline}
          className={`w-full h-7 text-[10px] font-bold rounded transition-all ${
            driver.isOnline 
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
              : 'bg-success hover:bg-success/90 text-success-foreground'
          }`}
          size="sm"
        >
          <div className="flex items-center justify-center gap-1.5">
            <Power size={10} />
            {driver.isOnline ? 'Go Offline' : 'Go Online'}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}