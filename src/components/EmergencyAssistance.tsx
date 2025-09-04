import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  ShieldWarning, 
  Phone, 
  Warning,
  FirstAid,
  Car,
  MapPin,
  Clock
} from "@phosphor-icons/react";
import { toast } from "sonner";

interface EmergencyAssistanceProps {
  driverLocation?: { lat: number; lng: number };
  onClose: () => void;
}

export function EmergencyAssistance({ driverLocation, onClose }: EmergencyAssistanceProps) {
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  const [isReporting, setIsReporting] = useState(false);

  const emergencyTypes = [
    {
      id: 'medical',
      title: 'Medical Emergency',
      icon: FirstAid,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      description: 'Medical assistance needed'
    },
    {
      id: 'accident',
      title: 'Vehicle Accident',
      icon: Car,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      description: 'Collision or vehicle damage'
    },
    {
      id: 'safety',
      title: 'Safety Concern',
      icon: ShieldWarning,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Unsafe situation or threat'
    },
    {
      id: 'breakdown',
      title: 'Vehicle Breakdown',
      icon: Warning,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      description: 'Mechanical issues'
    }
  ];

  const emergencyContacts = [
    {
      name: 'Emergency Services',
      number: '911',
      description: 'Police, Fire, Medical'
    },
    {
      name: 'GQ Cars Support',
      number: '1-800-GQ-CARS',
      description: '24/7 Driver Support'
    },
    {
      name: 'Roadside Assistance',
      number: '1-800-ROADSIDE',
      description: 'Vehicle breakdown help'
    }
  ];

  const handleEmergencyReport = async (emergencyType: string) => {
    setIsReporting(true);
    
    // Simulate emergency report
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const emergencyData = {
      type: emergencyType,
      timestamp: new Date().toISOString(),
      location: driverLocation || { lat: 0, lng: 0 },
      driverId: 'driver-001'
    };

    console.log('Emergency reported:', emergencyData);
    
    toast.success('Emergency reported. Help is on the way!');
    setIsReporting(false);
    setSelectedEmergency(null);
  };

  const handleCall = (number: string) => {
    // In a real app, this would initiate a phone call
    toast.info(`Calling ${number}...`);
  };

  return (
    <Card className="border-2 border-red-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-red-600">
            <ShieldWarning size={20} />
            Emergency Assistance
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emergency Alert */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <ShieldWarning size={20} className="text-red-500" />
            <span className="font-semibold text-red-700">Emergency Features</span>
          </div>
          <p className="text-sm text-red-600">
            Use these features only in genuine emergencies. Misuse may result in account suspension.
          </p>
        </div>

        {/* Quick Emergency Contacts */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Emergency Contacts
          </h4>
          <div className="space-y-2">
            {emergencyContacts.map((contact) => (
              <div key={contact.number} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-muted-foreground">{contact.description}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCall(contact.number)}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Phone size={16} className="mr-2" />
                  Call
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Types */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Report Emergency
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {emergencyTypes.map((emergency) => {
              const Icon = emergency.icon;
              return (
                <Button
                  key={emergency.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center gap-2 ${
                    selectedEmergency === emergency.id 
                      ? 'border-red-300 bg-red-50' 
                      : 'hover:border-red-200 hover:bg-red-50'
                  }`}
                  onClick={() => setSelectedEmergency(emergency.id)}
                >
                  <Icon size={24} className={emergency.color} />
                  <div className="text-center">
                    <div className="font-medium text-sm">{emergency.title}</div>
                    <div className="text-xs text-muted-foreground">{emergency.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Selected Emergency Actions */}
        {selectedEmergency && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Warning size={16} className="text-red-500" />
              <span className="font-semibold text-red-700">Emergency Selected</span>
            </div>
            
            <div className="text-sm text-red-600 mb-3">
              {emergencyTypes.find(e => e.id === selectedEmergency)?.description}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => handleEmergencyReport(selectedEmergency)}
                disabled={isReporting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isReporting ? 'Reporting...' : 'Report Emergency'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSelectedEmergency(null)}
                className="border-red-200"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Current Location */}
        {driverLocation && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-primary" />
              <span className="font-medium">Current Location</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Lat: {driverLocation.lat.toFixed(6)}, Lng: {driverLocation.lng.toFixed(6)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Location will be shared with emergency responders
            </div>
          </div>
        )}

        {/* Safety Tips */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ShieldWarning size={16} className="text-blue-600" />
            <span className="font-semibold text-blue-700">Safety Tips</span>
          </div>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• Stay calm and assess the situation</li>
            <li>• Move to a safe location if possible</li>
            <li>• Contact emergency services if in immediate danger</li>
            <li>• Keep your phone charged and accessible</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}