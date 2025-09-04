import { useState, useEffect } from "react";
import { useKV } from '@github/spark/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { DriverStatus } from "@/components/DriverStatus";
import { RideRequestCard } from "@/components/RideRequestCard";
import { ActiveTripCard } from "@/components/ActiveTripCard";
import { TripHistoryList } from "@/components/TripHistoryList";
import { EarningsSummary } from "@/components/EarningsSummary";
import { MapView } from "@/components/MapView";
import { DriverProfile } from "@/components/DriverProfile";
import { NotificationManager } from "@/components/NotificationManager";
import { EmergencyAssistance } from "@/components/EmergencyAssistance";
import { QuickSettings } from "@/components/QuickSettings";
import { Driver, RideRequest, ActiveTrip, TripHistory } from "@/types";
import { 
  Car, 
  Clock, 
  DollarSign, 
  History, 
  User, 
  Bell, 
  ShieldWarning,
  Map,
  List,
  Gear
} from "@phosphor-icons/react";

function App() {
  // Driver data persisted across sessions
  const [driver, setDriver] = useKV<Driver>("driver-profile", {
    id: "driver-001",
    name: "John Smith",
    email: "john.smith@gqcars.com",
    phone: "+1 (555) 123-4567",
    licenseNumber: "DL123456789",
    vehicleModel: "Toyota Camry 2022",
    vehiclePlate: "ABC-1234",
    isOnline: false,
    location: {
      lat: 40.7128,
      lng: -74.0060,
    },
    earnings: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    },
    trips: {
      completed: 0,
      cancelled: 0,
    },
    rating: 4.8,
  });

  const [tripHistory, setTripHistory] = useKV<TripHistory[]>("trip-history", []);
  
  // Current session state (doesn't persist)
  const [currentRequest, setCurrentRequest] = useState<RideRequest | null>(null);
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const [currentView, setCurrentView] = useState<'main' | 'profile' | 'notifications' | 'emergency' | 'settings'>('main');

  // Generate mock ride requests when driver is online
  useEffect(() => {
    if (!driver.isOnline || currentRequest || activeTrip) return;

    const generateRequest = () => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const mockRequest: RideRequest = {
          id: `req-${Date.now()}`,
          passenger: {
            id: `pass-${Date.now()}`,
            name: ["Sarah Johnson", "Mike Chen", "Emma Davis", "James Wilson"][Math.floor(Math.random() * 4)],
            phone: "+1 (555) " + Math.floor(100 + Math.random() * 900) + "-" + Math.floor(1000 + Math.random() * 9000),
            rating: 4.2 + Math.random() * 0.8,
            tripCount: Math.floor(5 + Math.random() * 50),
          },
          pickup: {
            address: ["123 Main St, Downtown", "456 Oak Ave, Midtown", "789 Pine Rd, Uptown"][Math.floor(Math.random() * 3)],
            lat: 40.7128 + (Math.random() - 0.5) * 0.1,
            lng: -74.0060 + (Math.random() - 0.5) * 0.1,
          },
          destination: {
            address: ["Airport Terminal 1", "Central Mall", "Business District", "University Campus"][Math.floor(Math.random() * 4)],
            lat: 40.7128 + (Math.random() - 0.5) * 0.1,
            lng: -74.0060 + (Math.random() - 0.5) * 0.1,
          },
          estimatedFare: 8.50 + Math.random() * 25,
          estimatedDistance: 2.1 + Math.random() * 8,
          estimatedDuration: Math.floor(8 + Math.random() * 25),
          requestedAt: new Date().toISOString(),
          paymentMethod: ["cash", "card", "digital_wallet"][Math.floor(Math.random() * 3)] as any,
          specialRequests: Math.random() < 0.3 ? "Please call when you arrive" : undefined,
        };
        setCurrentRequest(mockRequest);
        toast("New ride request!", { duration: 2000 });
      }
    };

    const interval = setInterval(generateRequest, 10000);
    return () => clearInterval(interval);
  }, [driver.isOnline, currentRequest, activeTrip]);

  const handleToggleOnline = () => {
    setDriver(currentDriver => ({
      ...currentDriver,
      isOnline: !currentDriver.isOnline
    }));
    
    if (driver.isOnline) {
      setCurrentRequest(null);
      setActiveTrip(null);
      toast.success("You're now offline");
    } else {
      toast.success("You're now online and ready to receive requests!");
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    if (!currentRequest) return;

    const newActiveTrip: ActiveTrip = {
      id: `trip-${Date.now()}`,
      request: currentRequest,
      status: 'going_to_pickup',
      startedAt: new Date().toISOString(),
    };

    setActiveTrip(newActiveTrip);
    setCurrentRequest(null);
    toast.success("Request accepted! Navigate to pickup location.");
  };

  const handleDeclineRequest = (requestId: string) => {
    setCurrentRequest(null);
    toast("Request declined");
  };

  const handleUpdateTripStatus = (tripId: string, status: ActiveTrip['status']) => {
    if (!activeTrip) return;

    setActiveTrip(currentTrip => 
      currentTrip ? { ...currentTrip, status } : null
    );

    const statusMessages = {
      'arrived_at_pickup': 'Arrived at pickup location',
      'passenger_on_board': 'Trip started! Navigate to destination.',
      'completed': 'Trip completed successfully!'
    };

    toast.success(statusMessages[status] || 'Status updated');
  };

  const handleCompleteTrip = (tripId: string) => {
    if (!activeTrip) return;

    const completedTrip: TripHistory = {
      id: activeTrip.id,
      passenger: activeTrip.request.passenger,
      pickup: activeTrip.request.pickup.address,
      destination: activeTrip.request.destination.address,
      fare: activeTrip.request.estimatedFare,
      distance: activeTrip.request.estimatedDistance,
      duration: activeTrip.request.estimatedDuration,
      completedAt: new Date().toISOString(),
      rating: 4.5 + Math.random() * 0.5,
      tip: Math.random() < 0.4 ? Math.random() * 5 : undefined,
    };

    // Update trip history
    setTripHistory(currentHistory => [completedTrip, ...currentHistory]);

    // Update driver earnings and stats
    setDriver(currentDriver => ({
      ...currentDriver,
      earnings: {
        ...currentDriver.earnings,
        today: currentDriver.earnings.today + completedTrip.fare + (completedTrip.tip || 0),
        thisWeek: currentDriver.earnings.thisWeek + completedTrip.fare + (completedTrip.tip || 0),
        thisMonth: currentDriver.earnings.thisMonth + completedTrip.fare + (completedTrip.tip || 0),
      },
      trips: {
        ...currentDriver.trips,
        completed: currentDriver.trips.completed + 1,
      },
    }));

    setActiveTrip(null);
    toast.success(`Trip completed! Earned $${(completedTrip.fare + (completedTrip.tip || 0)).toFixed(2)}`);
  };

  const handleNavigate = () => {
    if (activeTrip) {
      const destination = activeTrip.status === 'going_to_pickup' || activeTrip.status === 'arrived_at_pickup' 
        ? activeTrip.request.pickup 
        : activeTrip.request.destination;
      
      // Simulate opening navigation app
      toast.info(`Opening navigation to ${destination.address}`);
    }
  };

  const handleEditProfile = () => {
    toast.info("Profile editing would open here");
  };

  // Navigation header component
  const NavigationHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary rounded-lg">
          <Car size={24} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">GQ Cars Driver</h1>
          <p className="text-sm text-muted-foreground">Drive with confidence</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant={currentView === 'settings' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentView(currentView === 'settings' ? 'main' : 'settings')}
        >
          <Gear size={16} />
        </Button>
        <Button
          variant={currentView === 'notifications' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentView(currentView === 'notifications' ? 'main' : 'notifications')}
        >
          <Bell size={16} />
        </Button>
        <Button
          variant={currentView === 'emergency' ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => setCurrentView(currentView === 'emergency' ? 'main' : 'emergency')}
        >
          <ShieldWarning size={16} />
        </Button>
        <Button
          variant={currentView === 'profile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentView(currentView === 'profile' ? 'main' : 'profile')}
        >
          <User size={16} />
        </Button>
      </div>
    </div>
  );

  // Render different views based on currentView state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'profile':
        return (
          <DriverProfile 
            driver={driver} 
            onEditProfile={handleEditProfile}
          />
        );
      
      case 'notifications':
        return (
          <NotificationManager 
            onClose={() => setCurrentView('main')}
          />
        );
      
      case 'emergency':
        return (
          <EmergencyAssistance 
            driverLocation={driver.location}
            onClose={() => setCurrentView('main')}
          />
        );
      
      case 'settings':
        return (
          <QuickSettings 
            onClose={() => setCurrentView('main')}
          />
        );
      
      default:
        return (
          <>
            <DriverStatus driver={driver} onToggleOnline={handleToggleOnline} />

            {/* Map View for Active Trips */}
            {activeTrip && (
              <MapView
                pickup={activeTrip.request.pickup}
                destination={activeTrip.request.destination}
                currentStatus={activeTrip.status}
                onNavigate={handleNavigate}
              />
            )}

            {/* Active Trip or Request */}
            {activeTrip ? (
              <ActiveTripCard
                trip={activeTrip}
                onUpdateStatus={handleUpdateTripStatus}
                onCompleteTrip={handleCompleteTrip}
              />
            ) : currentRequest ? (
              <RideRequestCard
                request={currentRequest}
                onAccept={handleAcceptRequest}
                onDecline={handleDeclineRequest}
              />
            ) : driver.isOnline ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg mb-6">
                <Clock size={48} className="mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">Looking for rides...</h3>
                <p className="text-sm text-muted-foreground">
                  You're online and ready to receive requests
                </p>
              </div>
            ) : null}

            <Tabs defaultValue="earnings" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="earnings" className="flex items-center gap-2">
                  <DollarSign size={16} />
                  Earnings
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History size={16} />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="earnings">
                <EarningsSummary driver={driver} />
              </TabsContent>

              <TabsContent value="history">
                <TripHistoryList trips={tripHistory} />
              </TabsContent>
            </Tabs>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <NavigationHeader />
        {renderCurrentView()}
      </div>
      <Toaster />
    </div>
  );
}

export default App;