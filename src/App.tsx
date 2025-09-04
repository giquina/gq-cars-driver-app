import { useState, useEffect } from "react";
import { useKV } from '@github/spark/hooks';
import { useTheme } from '@/hooks/useTheme';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { DriverStatus } from "@/components/DriverStatus";
import { RideRequestCard } from "@/components/RideRequestCard";
import { ActiveTripCard } from "@/components/ActiveTripCard";
import { TripHistoryList } from "@/components/TripHistoryList";
import { EarningsSummary } from "@/components/EarningsSummary";
import { MapView } from "@/components/MapView";
import { DriverProfile } from "@/components/DriverProfile";
import { NotificationManager } from "@/components/NotificationManager";
import { QuickSettings } from "@/components/QuickSettings";
import { PassengerRating } from "@/components/PassengerRating";
import { GPSTracking } from "@/components/GPSTracking";
import { Driver, RideRequest, ActiveTrip, TripHistory } from "@/types";
import { 
  House, 
  Buildings, 
  Calendar, 
  Trophy, 
  List,
  Car, 
  Clock, 
  CurrencyGbp, 
  History, 
  User, 
  Bell, 
  Map,
  Gear,
  Star,
  Circle,
  Moon,
  Sun,
  Eye
} from "@phosphor-icons/react";

function AppContent() {
  const { theme, autoMode, toggleTheme } = useTheme();
  
  // Authentication state
  const [isSignedIn, setIsSignedIn] = useKV<boolean>("user-signed-in", false);
  
  // Driver data persisted across sessions
  const [driver, setDriver] = useKV<Driver>("driver-profile", {
    id: "driver-001",
    name: "John Smith",
    email: "john.smith@gqcars.com",
    phone: "+44 7700 900123",
    licenseNumber: "DL123456789",
    vehicleModel: "Toyota Camry 2022",
    vehiclePlate: "GQ22 ABC",
    isOnline: false,
    location: {
      lat: 51.5074,
      lng: -0.1278,
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
  const [currentView, setCurrentView] = useState<'home' | 'earnings' | 'schedule' | 'achievements' | 'menu' | 'passenger-rating'>('home');
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
            phone: "+44 7" + Math.floor(100 + Math.random() * 900) + " " + Math.floor(100000 + Math.random() * 900000),
            rating: 4.2 + Math.random() * 0.8,
            tripCount: Math.floor(5 + Math.random() * 50),
          },
          pickup: {
            address: ["123 Oxford Street, Central London", "456 King's Road, Chelsea", "789 Camden High Street, Camden"][Math.floor(Math.random() * 3)],
            lat: 51.5074 + (Math.random() - 0.5) * 0.1,
            lng: -0.1278 + (Math.random() - 0.5) * 0.1,
          },
          destination: {
            address: ["Heathrow Airport", "Canary Wharf", "Westminster", "Greenwich"][Math.floor(Math.random() * 4)],
            lat: 51.5074 + (Math.random() - 0.5) * 0.1,
            lng: -0.1278 + (Math.random() - 0.5) * 0.1,
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

  const handleSignIn = () => {
    setIsSignedIn(true);
    toast.success(`Welcome back, ${driver.name}!`);
  };

  const handleSwitchAccount = () => {
    toast.info("Account switching would open here");
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setDriver(currentDriver => ({
      ...currentDriver,
      isOnline: false
    }));
    setCurrentRequest(null);
    setActiveTrip(null);
    setCurrentView('home');
    toast.success("Signed out successfully");
  };

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
      toast.success("You're now online and ready for rides!");
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
    toast.success("Request accepted! Head to pickup location.");
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
      'passenger_on_board': 'Trip started! Head to destination.',
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
      const url = `https://www.google.com/maps/dir/${driver.location?.lat || 51.5074},${driver.location?.lng || -0.1278}/${destination.lat},${destination.lng}`;
      
      try {
        window.open(url, '_system');
        toast.success(`Opening directions to ${destination.address}`);
      } catch (error) {
        window.open(url, '_blank');
        toast.info(`Opening directions to ${destination.address}`);
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
    setCurrentView('home');
  };
  // Professional header component
  const ProfessionalHeader = () => (
    <div className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
            <Car size={20} className="text-white" weight="bold" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">GQ Cars</h1>
            <p className="text-xs text-muted-foreground">Professional Driver</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Earnings indicator */}
          <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
            <Eye size={12} className="text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">
              £{driver.earnings.today.toFixed(2)}
            </span>
          </div>
          
          {/* Online status */}
          <div className={`w-3 h-3 rounded-full ${driver.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}>
            {driver.isOnline && (
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Professional bottom navigation (Freenow style)
  const ProfessionalNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
            currentView === 'home'
              ? 'text-red-500'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <House size={20} weight="bold" />
          <span className="text-xs font-medium mt-1">Home</span>
        </button>

        {/* Earnings */}
        <button
          onClick={() => setCurrentView('earnings')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
            currentView === 'earnings'
              ? 'text-red-500'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <Buildings size={20} weight="bold" />
          <span className="text-xs font-medium mt-1">Earnings</span>
        </button>

        {/* Schedule */}
        <button
          onClick={() => setCurrentView('schedule')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
            currentView === 'schedule'
              ? 'text-red-500'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <Calendar size={20} weight="bold" />
          <span className="text-xs font-medium mt-1">Schedule</span>
        </button>

        {/* Achievements */}
        <button
          onClick={() => setCurrentView('achievements')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
            currentView === 'achievements'
              ? 'text-red-500'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <Trophy size={20} weight="bold" />
          <span className="text-xs font-medium mt-1">Trophy</span>
        </button>

        {/* Menu */}
        <button
          onClick={() => setCurrentView('menu')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
            currentView === 'menu'
              ? 'text-red-500'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <List size={20} weight="bold" />
          <span className="text-xs font-medium mt-1">Menu</span>
        </button>
      </div>
    </div>
  );

  // Render different views based on currentView state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'earnings':
        return (
          <div className="p-3 space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Earnings</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toggleTheme();
                  const newMode = theme === 'light' ? 'night' : 'day';
                  toast.success(`${newMode === 'night' ? 'Night' : 'Day'} mode`);
                }}
                className="h-8 w-8 p-0 rounded-full"
              >
                {theme === 'dark' ? (
                  <Sun size={14} className="text-amber-500" />
                ) : (
                  <Moon size={14} className="text-blue-500" />
                )}
              </Button>
            </div>
            
            <Tabs defaultValue="performance" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger value="performance" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  Performance
                </TabsTrigger>
                <TabsTrigger value="balance" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  Balance
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance" className="flex-1 mt-3">
                <EarningsSummary driver={driver} />
              </TabsContent>
              
              <TabsContent value="balance" className="flex-1 mt-3">
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="font-semibold mb-2">Account Balance</h3>
                  <div className="text-2xl font-bold text-green-600">£{driver.earnings.thisWeek.toFixed(2)}</div>
                  <p className="text-sm text-muted-foreground">Available for withdrawal</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
      
      case 'schedule':
        return (
          <div className="p-3 space-y-3 h-full">
            <h2 className="text-lg font-bold text-foreground">Schedule</h2>
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold mb-2">Today's Schedule</h3>
              <p className="text-muted-foreground">No scheduled rides</p>
            </div>
          </div>
        );
      
      case 'achievements':
        return (
          <div className="p-3 space-y-3 h-full">
            <h2 className="text-lg font-bold text-foreground">Achievements</h2>
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold mb-2">Your Progress</h3>
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-yellow-500" />
                <span>Driver Rating: {driver.rating}/5.0</span>
              </div>
            </div>
          </div>
        );
      
      case 'menu':
        return (
          <div className="p-3 space-y-3 h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User size={24} className="text-gray-500" />
              </div>
              <div>
                <h3 className="font-semibold text-base">{driver.name}</h3>
                <button className="text-red-500 text-sm font-medium">View profile</button>
              </div>
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto">
              <button 
                onClick={() => setCurrentView('earnings')}
                className="flex items-center justify-between w-full p-3 bg-card rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <Buildings size={18} className="text-gray-500" />
                  <span className="text-sm">Earnings</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
              
              <button 
                onClick={() => setCurrentView('achievements')}
                className="flex items-center justify-between w-full p-3 bg-card rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <Trophy size={18} className="text-gray-500" />
                  <span className="text-sm">Quests</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
              
              <button className="flex items-center justify-between w-full p-3 bg-card rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-gray-500" />
                  <span className="text-sm">Account</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
              
              <button className="flex items-center justify-between w-full p-3 bg-card rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center gap-3">
                  <span className="text-base">❓</span>
                  <span className="text-sm">Help</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
              
              <button className="flex items-center justify-between w-full p-3 bg-card rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center gap-3">
                  <span className="text-base">🎓</span>
                  <span className="text-sm">Learning Centre</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
            
            <div className="pt-3 border-t">
              <button className="text-gray-500 font-medium text-sm">Settings</button>
              <button 
                onClick={handleSignOut}
                className="block text-red-500 font-medium mt-2 text-sm"
              >
                Sign out
              </button>
            </div>
          </div>
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
              setCurrentView('home');
            }}
          />
        ) : null;
      
      default: // home
        return (
          <div className="p-3 space-y-3 h-full">
            {/* Compact stats row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-card rounded-lg p-2 border text-center">
                <div className="text-base font-bold text-green-600">£{driver.earnings.today.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Today</div>
              </div>
              <div className="bg-card rounded-lg p-2 border text-center">
                <div className="text-base font-bold text-foreground">{driver.trips.completed}</div>
                <div className="text-xs text-muted-foreground">Trips</div>
              </div>
              <div className="bg-card rounded-lg p-2 border text-center">
                <div className="text-base font-bold text-yellow-600">{driver.rating}</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </div>

            <DriverStatus driver={driver} onToggleOnline={handleToggleOnline} />

            {/* Map View for Active Trips - Compact */}
            {activeTrip && (
              <div className="h-40">
                <MapView
                  pickup={activeTrip.request.pickup}
                  destination={activeTrip.request.destination}
                  currentStatus={activeTrip.status}
                  onNavigate={handleNavigate}
                  showGPSTracking={true}
                  showRealTimeNavigation={true}
                />
              </div>
            )}

            {/* Active Trip or Request - Main content area */}
            <div className="flex-1 min-h-0">
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
                <div className="text-center py-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-dashed border-green-200 dark:border-green-800">
                  <div className="relative mb-2">
                    <Clock size={28} className="mx-auto text-green-600 animate-pulse" />
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  </div>
                  <h3 className="font-bold text-base mb-1 text-foreground">
                    Looking for rides...
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    You're online and ready to drive
                  </p>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-green-700 dark:text-green-300 font-semibold">AVAILABLE</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-card rounded-lg border">
                  <Car size={28} className="mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-semibold text-base mb-1 text-foreground">
                    Ready to Start?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Go online to start receiving ride requests
                  </p>
                </div>
              )}
            </div>

            {/* Recent trips - Only show if offline and space available */}
            {!driver.isOnline && !activeTrip && !currentRequest && tripHistory.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-foreground">Recent Trips</h3>
                <div className="space-y-1">
                  {tripHistory.slice(0, 2).map((trip) => (
                    <div key={trip.id} className="bg-card rounded-lg p-2 border flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-foreground">{trip.passenger.name}</div>
                        <div className="text-xs text-muted-foreground">{trip.destination}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">£{trip.fare.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{trip.distance.toFixed(1)}mi</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative flex flex-col">
      {!isSignedIn ? (
        <WelcomeScreen 
          driver={driver}
          onSignIn={handleSignIn}
          onSwitchAccount={handleSwitchAccount}
        />
      ) : (
        <>      
          <ProfessionalHeader />
          <div className="flex-1 max-w-md mx-auto relative z-10 flex flex-col pb-20 overflow-hidden">
            {renderCurrentView()}
          </div>
          
          <ProfessionalNavigation />
        </>
      )}
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px',
            boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;