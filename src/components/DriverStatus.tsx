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
    <Card className="mb-2 overflow-hidden bg-gradient-to-br from-card to-muted/20 border shadow-md">
      <CardContent className="p-2.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
                <Car size={18} className="text-primary-foreground" />
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-md flex items-center justify-center ${
                driver.isOnline ? 'bg-success' : 'bg-muted-foreground'
              }`}>
                {driver.isOnline && (
                  <div className="absolute inset-0 bg-success rounded-full animate-ping opacity-75" />
                )}
                <Circle size={4} weight="fill" className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-sm text-foreground">{driver.name}</h2>
              <p className="text-[10px] text-muted-foreground font-medium">{driver.vehicleModel}</p>
              <p className="text-[8px] text-muted-foreground bg-muted px-1 py-0.5 rounded inline-block mt-0.5">{driver.vehiclePlate}</p>
            </div>
          </div>
          <Badge 
            variant={driver.isOnline ? "default" : "secondary"} 
            className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded-full shadow-sm ${
              driver.isOnline 
                ? 'bg-success text-success-foreground border-success/20' 
                : 'bg-muted text-muted-foreground border-muted-foreground/20'
            }`}
          >
            <Circle size={4} weight="fill" />
            {driver.isOnline ? 'ONLINE' : 'OFFLINE'}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mb-2">
          <div className="text-center p-1.5 bg-gradient-to-br from-success/10 to-success/5 rounded border border-success/20">
            <div className="flex items-center justify-center mb-0.5">
              <CurrencyGbp size={10} className="text-success mr-0.5" weight="bold" />
              <div className="text-xs font-bold text-success">£{driver.earnings.today.toFixed(2)}</div>
            </div>
            <div className="text-[8px] text-muted-foreground font-medium">Today</div>
          </div>
          <div className="text-center p-1.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded border border-primary/20">
            <div className="flex items-center justify-center mb-0.5">
              <TrendUp size={10} className="text-primary mr-0.5" weight="bold" />
              <div className="text-xs font-bold text-primary">{driver.trips.completed}</div>
            </div>
            <div className="text-[8px] text-muted-foreground font-medium">Trips</div>
          </div>
          <div className="text-center p-1.5 bg-gradient-to-br from-yellow-500/10 to-yellow-400/5 rounded border border-yellow-400/20">
            <div className="flex items-center justify-center mb-0.5">
              <Star size={10} className="text-yellow-600 mr-0.5" weight="fill" />
              <div className="text-xs font-bold text-yellow-600">{driver.rating.toFixed(1)}</div>
            </div>
            <div className="text-[8px] text-muted-foreground font-medium">Rating</div>
          </div>
        </div>

        <Button 
          onClick={onToggleOnline}
          className={`w-full h-8 text-xs font-bold rounded transition-all duration-300 shadow-md ${
            driver.isOnline 
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground border border-destructive/30' 
              : 'bg-success hover:bg-success/90 text-success-foreground border border-success/30'
          }`}
          size="sm"
        >
          <div className="flex items-center justify-center gap-2">
            <Power size={12} weight="bold" />
            {driver.isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}