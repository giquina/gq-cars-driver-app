import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Driver } from "@/types/index";
import { 
  User, 
  Car, 
  Phone, 
  Mail, 
  CreditCard, 
  Star,
  Edit,
  ShieldCheck,
  SignOut
} from "@phosphor-icons/react";

interface DriverProfileProps {
  driver: Driver;
  onEditProfile: () => void;
  onSignOut?: () => void;
}

export function DriverProfile({ driver, onEditProfile, onSignOut }: DriverProfileProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm">
            <User size={16} />
            My Profile
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onEditProfile} className="h-7 text-[9px]">
            <Edit size={12} className="mr-1" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        {/* Profile Header */}
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={driver.profilePhoto} alt={driver.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {getInitials(driver.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-sm font-bold">{driver.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star size={12} weight="fill" className="text-accent" />
              <span className="font-semibold text-xs">{driver.rating.toFixed(1)}</span>
              <Badge variant="outline" className="text-[8px] px-1">
                <ShieldCheck size={8} className="mr-0.5" />
                Verified
              </Badge>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <h4 className="font-semibold text-[9px] text-muted-foreground uppercase tracking-wider">
            Contact
          </h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 p-1.5 rounded bg-muted/30">
              <Phone size={12} className="text-muted-foreground" />
              <span className="text-[9px]">{driver.phone}</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-muted/30">
              <Mail size={12} className="text-muted-foreground" />
              <span className="text-[9px]">{driver.email}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="space-y-2">
          <h4 className="font-semibold text-[9px] text-muted-foreground uppercase tracking-wider">
            My Car
          </h4>
          <div className="flex items-center gap-2 p-1.5 rounded bg-muted/30">
            <Car size={12} className="text-muted-foreground" />
            <div className="flex-1">
              <div className="text-[9px] font-medium">{driver.vehicleModel}</div>
              <div className="text-[8px] text-muted-foreground">Plate: {driver.vehiclePlate}</div>
            </div>
          </div>
        </div>

        {/* License Information */}
        <div className="space-y-2">
          <h4 className="font-semibold text-[9px] text-muted-foreground uppercase tracking-wider">
            License
          </h4>
          <div className="flex items-center gap-2 p-1.5 rounded bg-muted/30">
            <CreditCard size={12} className="text-muted-foreground" />
            <div className="flex-1">
              <div className="text-[9px] font-medium">Driver's License</div>
              <div className="text-[8px] text-muted-foreground">{driver.licenseNumber}</div>
            </div>
            <Badge variant="secondary" className="text-[7px] px-1">
              <ShieldCheck size={6} className="mr-0.5" />
              Valid
            </Badge>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="space-y-2">
          <h4 className="font-semibold text-[9px] text-muted-foreground uppercase tracking-wider">
            My Stats
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-accent/10 rounded">
              <div className="text-sm font-bold text-accent">{driver.trips.completed}</div>
              <div className="text-[7px] text-muted-foreground">Done</div>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded">
              <div className="text-sm font-bold">{driver.trips.cancelled}</div>
              <div className="text-[7px] text-muted-foreground">Missed</div>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        {onSignOut && (
          <div className="pt-2 border-t border-border">
            <Button 
              variant="outline" 
              onClick={onSignOut}
              className="w-full h-8 text-xs text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              <SignOut size={12} className="mr-1.5" />
              Sign Out
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}