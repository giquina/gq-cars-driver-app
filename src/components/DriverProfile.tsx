import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Driver } from "@/types";
import { 
  User, 
  Car, 
  Phone, 
  Mail, 
  CreditCard, 
  Star,
  Edit,
  ShieldCheck
} from "@phosphor-icons/react";

interface DriverProfileProps {
  driver: Driver;
  onEditProfile: () => void;
}

export function DriverProfile({ driver, onEditProfile }: DriverProfileProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            Driver Profile
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onEditProfile}>
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={driver.profilePhoto} alt={driver.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {getInitials(driver.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{driver.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Star size={16} weight="fill" className="text-accent" />
              <span className="font-semibold">{driver.rating.toFixed(1)}</span>
              <Badge variant="outline" className="text-xs">
                <ShieldCheck size={12} className="mr-1" />
                Verified Driver
              </Badge>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Contact Information
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
              <Phone size={16} className="text-muted-foreground" />
              <span className="text-sm">{driver.phone}</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
              <Mail size={16} className="text-muted-foreground" />
              <span className="text-sm">{driver.email}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Vehicle Information
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
              <Car size={16} className="text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">{driver.vehicleModel}</div>
                <div className="text-xs text-muted-foreground">License: {driver.vehiclePlate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* License Information */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            License Information
          </h4>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
            <CreditCard size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <div className="text-sm font-medium">Driver's License</div>
              <div className="text-xs text-muted-foreground">{driver.licenseNumber}</div>
            </div>
            <Badge variant="secondary" className="text-xs">
              <ShieldCheck size={12} className="mr-1" />
              Valid
            </Badge>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Performance Stats
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-accent/10 rounded-lg">
              <div className="text-lg font-bold text-accent">{driver.trips.completed}</div>
              <div className="text-xs text-muted-foreground">Completed Trips</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold">{driver.trips.cancelled}</div>
              <div className="text-xs text-muted-foreground">Cancelled Trips</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}