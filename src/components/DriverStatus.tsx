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
    <Card className="mb-3 overflow-hidden bg-gradient-to-br from-card to-muted/20 border shadow-md">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
                <Car size={20} className="text-primary-foreground" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center ${
                driver.isOnline ? 'bg-success' : 'bg-muted-foreground'
              }`}>
                {driver.isOnline && (
                  <div className="absolute inset-0 bg-success rounded-full animate-ping opacity-75" />
                )}
                <Circle size={6} weight="fill" className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-sm text-foreground">{driver.name}</h2>
              <p className="text-[10px] text-muted-foreground font-medium">{driver.vehicleModel}</p>
              <p className="text-[8px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md inline-block mt-0.5">{driver.vehiclePlate}</p>
            </div>
          </div>
          <Badge 
            variant={driver.isOnline ? "default" : "secondary"} 
            className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-full shadow-sm ${
              driver.isOnline 
                ? 'bg-success text-success-foreground border-success/20' 
                : 'bg-muted text-muted-foreground border-muted-foreground/20'
            }`}
          >
            <Circle size={6} weight="fill" />
            {driver.isOnline ? 'ONLINE' : 'OFFLINE'}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-success/20">
            <div className="flex items-center justify-center mb-1">
              <CurrencyGbp size={12} className="text-success mr-0.5" weight="bold" />
              <div className="text-sm font-bold text-success">£{driver.earnings.today.toFixed(2)}</div>
            </div>
            <div className="text-[8px] text-muted-foreground font-medium">Today</div>
          </div>
          <div className="text-center p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-center mb-1">
              <TrendUp size={12} className="text-primary mr-0.5" weight="bold" />
              <div className="text-sm font-bold text-primary">{driver.trips.completed}</div>
            </div>
            <div className="text-[8px] text-muted-foreground font-medium">Trips</div>
          </div>
          <div className="text-center p-2 bg-gradient-to-br from-yellow-500/10 to-yellow-400/5 rounded-lg border border-yellow-400/20">
            <div className="flex items-center justify-center mb-1">
              <Star size={12} className="text-yellow-600 mr-0.5" weight="fill" />
              <div className="text-sm font-bold text-yellow-600">{driver.rating.toFixed(1)}</div>
            </div>
            <div className="text-[8px] text-muted-foreground font-medium">Rating</div>
          </div>
        </div>

        <Button 
          onClick={onToggleOnline}
          className={`w-full h-10 text-sm font-bold rounded-lg transition-all duration-300 shadow-md ${
            driver.isOnline 
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground border border-destructive/30' 
              : 'bg-success hover:bg-success/90 text-success-foreground border border-success/30'
          }`}
          size="sm"
        >
          <div className="flex items-center justify-center gap-2">
            <Power size={14} weight="bold" />
            {driver.isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}