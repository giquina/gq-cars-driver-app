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
import { AIAssistant } from "@/components/AIAssistant";
import { PassengerRating } from "@/components/PassengerRating";
import { GPSTracking } from "@/components/GPSTracking";
import { Driver, RideRequest, ActiveTrip, TripHistory } from "@/types";
import { 
  Car, 
  Clock, 
  CurrencyGbp, 
  History, 
  User, 
  Bell, 
  ShieldWarning,
  Map,
  List,
  Gear,
  Robot,
  Star
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
  const [currentView, setCurrentView] = useState<'main' | 'profile' | 'notifications' | 'emergency' | 'settings' | 'ai-assistant' | 'passenger-rating'>('main');
  const [completedTripForRating, setCompletedTripForRating] = useState<ActiveTrip | null>(null);

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
          estimatedFare: 6.80 + Math.random() * 20, // GBP prices
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

    // Set up for passenger rating
    setCompletedTripForRating(activeTrip);
    setActiveTrip(null);
    setCurrentView('passenger-rating');
    
    toast.success(`Trip completed! Earned £${(completedTrip.fare + (completedTrip.tip || 0)).toFixed(2)}`);
  };

  const handleNavigate = () => {
    if (activeTrip) {
      const destination = activeTrip.status === 'going_to_pickup' || activeTrip.status === 'arrived_at_pickup' 
        ? activeTrip.request.pickup 
        : activeTrip.request.destination;
      
      // Open external navigation app
      const url = `https://www.google.com/maps/dir/${driver.location?.lat || 40.7128},${driver.location?.lng || -74.0060}/${destination.lat},${destination.lng}`;
      
      try {
        window.open(url, '_system');
        toast.success(`Opening navigation to ${destination.address}`);
      } catch (error) {
        window.open(url, '_blank');
        toast.info(`Opening navigation to ${destination.address}`);
      }
    }
  };

  const handleEditProfile = () => {
    toast.info("Profile editing would open here");
  };

  const handleSubmitPassengerRating = (rating: number, feedback?: string, tip?: number) => {
    if (!completedTripForRating) return;
    
    // Update trip history with rating
    setTripHistory(currentHistory => 
      currentHistory.map(trip => 
        trip.id === completedTripForRating.id 
          ? { ...trip, passengerRating: rating, passengerFeedback: feedback, tip: tip || trip.tip }
          : trip
      )
    );
    
    // Update earnings if tip was added
    if (tip) {
      setDriver(currentDriver => ({
        ...currentDriver,
        earnings: {
          ...currentDriver.earnings,
          today: currentDriver.earnings.today + tip,
          thisWeek: currentDriver.earnings.thisWeek + tip,
          thisMonth: currentDriver.earnings.thisMonth + tip,
        },
      }));
    }
    
    setCompletedTripForRating(null);
    setCurrentView('main');
  };

  // Navigation header component
  const NavigationHeader = () => (
    <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-br from-card via-muted/5 to-accent/5 rounded-3xl border-2 border-primary/10 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-primary rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
            <Car size={32} className="text-primary-foreground" weight="bold" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-success to-accent rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            GQ Cars Driver
          </h1>
          <p className="text-base text-muted-foreground font-semibold">Drive with confidence & intelligence</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant={currentView === 'ai-assistant' ? 'default' : 'outline'}
          size="lg"
          onClick={() => setCurrentView(currentView === 'ai-assistant' ? 'main' : 'ai-assistant')}
          className={`relative h-12 w-12 rounded-2xl border-2 transition-all duration-300 transform hover:scale-110 ${
            currentView === 'ai-assistant' 
              ? 'bg-gradient-to-br from-primary to-accent text-white border-primary/30 shadow-xl' 
              : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
          }`}
        >
          <Robot size={20} weight="bold" />
          {currentView === 'ai-assistant' && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-success to-green-400 rounded-full border-2 border-white shadow-lg">
              <div className="absolute inset-0 bg-success rounded-full animate-ping opacity-75" />
            </div>
          )}
        </Button>
        
        <Button
          variant={currentView === 'settings' ? 'default' : 'outline'}
          size="lg"
          onClick={() => setCurrentView(currentView === 'settings' ? 'main' : 'settings')}
          className={`relative h-12 w-12 rounded-2xl border-2 transition-all duration-300 transform hover:scale-110 ${
            currentView === 'settings' 
              ? 'bg-gradient-to-br from-primary to-accent text-white border-primary/30 shadow-xl' 
              : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
          }`}
        >
          <Gear size={20} weight="bold" />
        </Button>
        
        <Button
          variant={currentView === 'notifications' ? 'default' : 'outline'}
          size="lg"
          onClick={() => setCurrentView(currentView === 'notifications' ? 'main' : 'notifications')}
          className={`relative h-12 w-12 rounded-2xl border-2 transition-all duration-300 transform hover:scale-110 ${
            currentView === 'notifications' 
              ? 'bg-gradient-to-br from-primary to-accent text-white border-primary/30 shadow-xl' 
              : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
          }`}
        >
          <Bell size={20} weight="bold" />
        </Button>
        
        <Button
          variant={currentView === 'emergency' ? 'destructive' : 'outline'}
          size="lg"
          onClick={() => setCurrentView(currentView === 'emergency' ? 'main' : 'emergency')}
          className={`relative h-12 w-12 rounded-2xl border-2 transition-all duration-300 transform hover:scale-110 ${
            currentView === 'emergency' 
              ? 'bg-gradient-to-br from-destructive to-red-600 text-white border-destructive/30 shadow-xl' 
              : 'border-destructive/30 hover:border-destructive/50 hover:bg-destructive/5 text-destructive'
          }`}
        >
          <ShieldWarning size={20} weight="bold" />
        </Button>
        
        <Button
          variant={currentView === 'profile' ? 'default' : 'outline'}
          size="lg"
          onClick={() => setCurrentView(currentView === 'profile' ? 'main' : 'profile')}
          className={`relative h-12 w-12 rounded-2xl border-2 transition-all duration-300 transform hover:scale-110 ${
            currentView === 'profile' 
              ? 'bg-gradient-to-br from-primary to-accent text-white border-primary/30 shadow-xl' 
              : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
          }`}
        >
          <User size={20} weight="bold" />
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
      
      case 'ai-assistant':
        return (
          <AIAssistant 
            driverLocation={driver.location}
            isOnline={driver.isOnline}
            onClose={() => setCurrentView('main')}
          />
        );
      
      case 'passenger-rating':
        return completedTripForRating ? (
          <PassengerRating 
            passenger={completedTripForRating.request.passenger}
            tripDetails={{
              fare: completedTripForRating.request.estimatedFare,
              distance: completedTripForRating.request.estimatedDistance,
              duration: completedTripForRating.request.estimatedDuration,
            }}
            onSubmitRating={handleSubmitPassengerRating}
            onClose={() => {
              setCompletedTripForRating(null);
              setCurrentView('main');
            }}
          />
        ) : null;
      
      default:
        return (
          <div className="space-y-6">
            <DriverStatus driver={driver} onToggleOnline={handleToggleOnline} />

            {/* Map View for Active Trips */}
            {activeTrip && (
              <MapView
                pickup={activeTrip.request.pickup}
                destination={activeTrip.request.destination}
                currentStatus={activeTrip.status}
                onNavigate={handleNavigate}
                showGPSTracking={true}
                showRealTimeNavigation={true}
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
              <div className="text-center py-20 bg-gradient-to-br from-success/10 via-accent/5 to-primary/10 rounded-3xl border-2 border-dashed border-primary/20 mb-8 shadow-xl backdrop-blur-sm">
                <div className="relative mb-6">
                  <Clock size={80} className="mx-auto text-primary animate-pulse drop-shadow-lg" weight="bold" />
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-success to-accent rounded-full animate-ping" />
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
                </div>
                <h3 className="font-black text-2xl mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Searching for rides...
                </h3>
                <p className="text-base text-muted-foreground mb-6 font-semibold">
                  You're online and ready to receive requests
                </p>
                <div className="flex justify-center">
                  <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-success/20 via-accent/10 to-success/20 rounded-full border-2 border-success/30 shadow-lg backdrop-blur-sm">
                    <div className="w-3 h-3 bg-gradient-to-r from-success to-accent rounded-full animate-pulse" />
                    <span className="text-base text-success font-black">LIVE & ACTIVE</span>
                    <div className="w-3 h-3 bg-gradient-to-r from-accent to-success rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ) : null}

            <Tabs defaultValue="earnings" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 h-14 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 rounded-2xl p-2 border-2 border-muted/40">
                <TabsTrigger 
                  value="earnings" 
                  className="flex items-center gap-3 h-10 rounded-xl font-bold text-base transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-success data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105"
                >
                  <CurrencyGbp size={20} weight="bold" />
                  Earnings
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="flex items-center gap-3 h-10 rounded-xl font-bold text-base transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105"
                >
                  <History size={20} weight="bold" />
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
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_theme(colors.primary/10),_transparent_50%),radial-gradient(circle_at_80%_20%,_theme(colors.accent/10),_transparent_50%),radial-gradient(circle_at_40%_40%,_theme(colors.muted/20),_transparent_50%)]" />
      
      <div className="container mx-auto px-6 py-8 max-w-md relative z-10">
        <NavigationHeader />
        {renderCurrentView()}
      </div>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '2px solid hsl(var(--border))',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '600',
            padding: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          },
        }}
      />
    </div>
  );
}

export default App;