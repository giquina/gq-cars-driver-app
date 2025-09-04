import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useKV } from '@github/spark/hooks';
import { 
  Settings, 
  Moon, 
  MapPin,
  VolumeHigh,
  Bluetooth,
  Shield,
  Star,
  DollarSign
} from "@phosphor-icons/react";

interface AppSettings {
  darkMode: boolean;
  autoAcceptGoodRides: boolean;
  locationSharing: boolean;
  soundAlerts: boolean;
  bluetoothIntegration: boolean;
  showEarningsToPassengers: boolean;
  acceptOnlyHighRatedPassengers: boolean;
  minimumFareThreshold: number;
}

interface QuickSettingsProps {
  onClose: () => void;
}

export function QuickSettings({ onClose }: QuickSettingsProps) {
  const [settings, setSettings] = useKV<AppSettings>("app-settings", {
    darkMode: false,
    autoAcceptGoodRides: false,
    locationSharing: true,
    soundAlerts: true,
    bluetoothIntegration: false,
    showEarningsToPassengers: false,
    acceptOnlyHighRatedPassengers: false,
    minimumFareThreshold: 5.00,
  });

  const handleToggle = (key: keyof Omit<AppSettings, 'minimumFareThreshold'>) => {
    setSettings(current => ({
      ...current,
      [key]: !current[key]
    }));
  };

  const settingsItems = [
    {
      key: 'locationSharing' as const,
      title: 'Location Sharing',
      description: 'Share real-time location with passengers',
      icon: MapPin,
      enabled: settings.locationSharing,
      iconColor: 'text-blue-500'
    },
    {
      key: 'soundAlerts' as const,
      title: 'Sound Alerts',
      description: 'Audio notifications for ride requests',
      icon: VolumeHigh,
      enabled: settings.soundAlerts,
      iconColor: 'text-green-500'
    },
    {
      key: 'bluetoothIntegration' as const,
      title: 'Bluetooth Integration',
      description: 'Connect with car audio system',
      icon: Bluetooth,
      enabled: settings.bluetoothIntegration,
      iconColor: 'text-blue-600'
    },
    {
      key: 'acceptOnlyHighRatedPassengers' as const,
      title: 'High-Rated Passengers Only',
      description: 'Only accept rides from 4+ star passengers',
      icon: Star,
      enabled: settings.acceptOnlyHighRatedPassengers,
      iconColor: 'text-yellow-500'
    },
    {
      key: 'autoAcceptGoodRides' as const,
      title: 'Auto-Accept Good Rides',
      description: 'Automatically accept high-fare, short-distance rides',
      icon: DollarSign,
      enabled: settings.autoAcceptGoodRides,
      iconColor: 'text-green-600'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Quick Settings
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Settings List */}
        <div className="space-y-4">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <Icon size={20} className={item.iconColor} />
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </div>
                <Switch 
                  checked={item.enabled}
                  onCheckedChange={() => handleToggle(item.key)}
                />
              </div>
            );
          })}
        </div>

        {/* Minimum Fare Setting */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Ride Preferences
          </h4>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Minimum Fare</span>
              <span className="text-accent font-bold">£{settings.minimumFareThreshold.toFixed(2)}</span>
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              Decline rides below this fare amount
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSettings(current => ({ 
                  ...current, 
                  minimumFareThreshold: Math.max(0, current.minimumFareThreshold - 1) 
                }))}
              >
                -£1
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSettings(current => ({ 
                  ...current, 
                  minimumFareThreshold: current.minimumFareThreshold + 1 
                }))}
              >
                +£1
              </Button>
            </div>
          </div>
        </div>

        {/* Privacy & Safety */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Privacy & Safety
          </h4>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-blue-500" />
              <div className="flex-1">
                <div className="font-medium">Safety Features</div>
                <div className="text-sm text-muted-foreground">
                  Emergency button, trip sharing, and safety checks are always enabled
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Summary */}
        <div className="p-3 bg-accent/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings size={16} className="text-accent" />
            <span className="font-medium text-accent">Settings Summary</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {settingsItems.filter(item => item.enabled).length} of {settingsItems.length} features enabled
          </div>
        </div>
      </CardContent>
    </Card>
  );
}