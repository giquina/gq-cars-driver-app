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
    <Card className="mb-6 overflow-hidden bg-gradient-to-br from-card to-muted/20 border shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <Car size={32} className="text-primary-foreground" />
              </div>
              <div className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full border-3 border-white shadow-lg flex items-center justify-center ${
                driver.isOnline ? 'bg-success' : 'bg-muted-foreground'
              }`}>
                {driver.isOnline && (
                  <div className="absolute inset-0 bg-success rounded-full animate-ping opacity-75" />
                )}
                <Circle size={12} weight="fill" className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-xl text-foreground">{driver.name}</h2>
              <p className="text-sm text-muted-foreground font-medium">{driver.vehicleModel}</p>
              <p className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg inline-block mt-1">{driver.vehiclePlate}</p>
            </div>
          </div>
          <Badge 
            variant={driver.isOnline ? "default" : "secondary"} 
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full shadow-md ${
              driver.isOnline 
                ? 'bg-success text-success-foreground border-success/20' 
                : 'bg-muted text-muted-foreground border-muted-foreground/20'
            }`}
          >
            <Circle size={8} weight="fill" />
            {driver.isOnline ? 'ONLINE' : 'OFFLINE'}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border border-success/20">
            <div className="flex items-center justify-center mb-2">
              <CurrencyGbp size={18} className="text-success mr-1" weight="bold" />
              <div className="text-2xl font-bold text-success">£{driver.earnings.today.toFixed(2)}</div>
            </div>
            <div className="text-xs text-muted-foreground font-medium">Today's Earnings</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center justify-center mb-2">
              <TrendUp size={18} className="text-primary mr-1" weight="bold" />
              <div className="text-2xl font-bold text-primary">{driver.trips.completed}</div>
            </div>
            <div className="text-xs text-muted-foreground font-medium">Completed Trips</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-400/5 rounded-xl border border-yellow-400/20">
            <div className="flex items-center justify-center mb-2">
              <Star size={18} className="text-yellow-600 mr-1" weight="fill" />
              <div className="text-2xl font-bold text-yellow-600">{driver.rating.toFixed(1)}</div>
            </div>
            <div className="text-xs text-muted-foreground font-medium">Driver Rating</div>
          </div>
        </div>

        <Button 
          onClick={onToggleOnline}
          className={`w-full h-14 text-lg font-bold rounded-xl transition-all duration-300 shadow-lg ${
            driver.isOnline 
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground border-2 border-destructive/30' 
              : 'bg-success hover:bg-success/90 text-success-foreground border-2 border-success/30'
          }`}
          size="lg"
        >
          <div className="flex items-center justify-center gap-3">
            <Power size={20} weight="bold" />
            {driver.isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}