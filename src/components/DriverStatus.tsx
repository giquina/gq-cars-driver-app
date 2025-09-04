import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Driver } from "@/types";
import { Circle, Car, CurrencyGbp, Star, TrendUp } from "@phosphor-icons/react";

interface DriverStatusProps {
  driver: Driver;
  onToggleOnline: () => void;
}

export function DriverStatus({ driver, onToggleOnline }: DriverStatusProps) {
  return (
    <Card className="mb-6 overflow-hidden bg-gradient-to-br from-card via-card/95 to-muted/20 border-2 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary via-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <Car size={32} className="text-primary-foreground" />
              </div>
              <div className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${
                driver.isOnline ? 'bg-success' : 'bg-muted-foreground'
              }`}>
                {driver.isOnline && (
                  <div className="absolute inset-0 bg-success rounded-full animate-ping opacity-75" />
                )}
                <Circle size={12} weight="fill" className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-2xl text-foreground">{driver.name}</h2>
              <p className="text-base text-muted-foreground font-semibold">{driver.vehicleModel}</p>
              <p className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-full inline-block mt-1">{driver.vehiclePlate}</p>
            </div>
          </div>
          <Badge 
            variant={driver.isOnline ? "default" : "secondary"} 
            className={`flex items-center gap-2 px-4 py-2 text-base font-bold rounded-full shadow-lg ${
              driver.isOnline 
                ? 'bg-gradient-to-r from-success to-success/80 text-white border-success/20 animate-pulse-once' 
                : 'bg-muted text-muted-foreground border-muted-foreground/20'
            }`}
          >
            <Circle size={10} weight="fill" />
            {driver.isOnline ? 'ONLINE' : 'OFFLINE'}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-5 bg-gradient-to-br from-success/15 via-success/10 to-success/5 rounded-2xl border-2 border-success/20 hover:border-success/40 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-center mb-2">
              <CurrencyGbp size={20} className="text-success mr-1" weight="bold" />
              <div className="text-3xl font-black text-success">£{driver.earnings.today.toFixed(2)}</div>
            </div>
            <div className="text-sm text-muted-foreground font-semibold">Today's Earnings</div>
          </div>
          <div className="text-center p-5 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 rounded-2xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-center mb-2">
              <TrendUp size={20} className="text-primary mr-1" weight="bold" />
              <div className="text-3xl font-black text-primary">{driver.trips.completed}</div>
            </div>
            <div className="text-sm text-muted-foreground font-semibold">Completed Trips</div>
          </div>
          <div className="text-center p-5 bg-gradient-to-br from-yellow-500/15 via-yellow-400/10 to-yellow-300/5 rounded-2xl border-2 border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-center mb-2">
              <Star size={20} className="text-yellow-600 mr-1" weight="fill" />
              <div className="text-3xl font-black text-yellow-600">{driver.rating.toFixed(1)}</div>
            </div>
            <div className="text-sm text-muted-foreground font-semibold">Driver Rating</div>
          </div>
        </div>

        <Button 
          onClick={onToggleOnline}
          className={`w-full h-16 text-xl font-bold rounded-2xl transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl ${
            driver.isOnline 
              ? 'bg-gradient-to-r from-destructive via-destructive to-destructive/80 hover:from-destructive/90 hover:via-destructive/90 hover:to-destructive/70 text-white border-2 border-destructive/30' 
              : 'bg-gradient-to-r from-success via-accent to-success hover:from-success/90 hover:via-accent/90 hover:to-success/90 text-white border-2 border-success/30'
          }`}
          size="lg"
        >
          <div className="flex items-center justify-center gap-3">
            <Circle size={16} weight="fill" />
            {driver.isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}