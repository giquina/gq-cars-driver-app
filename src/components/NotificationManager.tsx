import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useKV } from '@github/spark/hooks';
import { 
  Bell, 
  Car, 
  DollarSign, 
  Clock,
  Volume2,
  VolumeOff,
  Settings
} from "@phosphor-icons/react";

interface NotificationSettings {
  rideRequests: boolean;
  earnings: boolean;
  tripUpdates: boolean;
  sound: boolean;
  vibration: boolean;
}

interface NotificationManagerProps {
  onClose: () => void;
}

export function NotificationManager({ onClose }: NotificationManagerProps) {
  const [settings, setSettings] = useKV<NotificationSettings>("notification-settings", {
    rideRequests: true,
    earnings: true,
    tripUpdates: true,
    sound: true,
    vibration: true,
  });

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(current => ({
      ...current,
      [key]: !current[key]
    }));
  };

  const testNotification = () => {
    if (settings.sound) {
      // Simple audio feedback
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    if ('vibrate' in navigator && settings.vibration) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Notification Settings
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Types */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Notification Types
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Car size={20} className="text-primary" />
                <div>
                  <div className="font-medium">Ride Requests</div>
                  <div className="text-sm text-muted-foreground">New trip requests</div>
                </div>
              </div>
              <Switch 
                checked={settings.rideRequests}
                onCheckedChange={() => handleToggle('rideRequests')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign size={20} className="text-accent" />
                <div>
                  <div className="font-medium">Earnings Updates</div>
                  <div className="text-sm text-muted-foreground">Payment confirmations</div>
                </div>
              </div>
              <Switch 
                checked={settings.earnings}
                onCheckedChange={() => handleToggle('earnings')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-primary" />
                <div>
                  <div className="font-medium">Trip Updates</div>
                  <div className="text-sm text-muted-foreground">Status changes</div>
                </div>
              </div>
              <Switch 
                checked={settings.tripUpdates}
                onCheckedChange={() => handleToggle('tripUpdates')}
              />
            </div>
          </div>
        </div>

        {/* Notification Behavior */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Notification Behavior
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                {settings.sound ? (
                  <Volume2 size={20} className="text-accent" />
                ) : (
                  <VolumeOff size={20} className="text-muted-foreground" />
                )}
                <div>
                  <div className="font-medium">Sound</div>
                  <div className="text-sm text-muted-foreground">Audio alerts</div>
                </div>
              </div>
              <Switch 
                checked={settings.sound}
                onCheckedChange={() => handleToggle('sound')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-primary" />
                <div>
                  <div className="font-medium">Vibration</div>
                  <div className="text-sm text-muted-foreground">Haptic feedback</div>
                </div>
              </div>
              <Switch 
                checked={settings.vibration}
                onCheckedChange={() => handleToggle('vibration')}
              />
            </div>
          </div>
        </div>

        {/* Test Notification */}
        <div className="pt-4 border-t">
          <Button 
            onClick={testNotification}
            variant="outline"
            className="w-full"
          >
            <Bell size={16} className="mr-2" />
            Test Notifications
          </Button>
        </div>

        {/* Status Summary */}
        <div className="p-3 bg-accent/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Bell size={16} className="text-accent" />
            <span className="font-medium text-accent">Notification Status</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {Object.values(settings).filter(Boolean).length} of {Object.keys(settings).length} notifications enabled
          </div>
        </div>
      </CardContent>
    </Card>
  );
}