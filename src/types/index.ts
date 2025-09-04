export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleModel: string;
  vehiclePlate: string;
  profilePhoto?: string;
  isOnline: boolean;
  location?: {
    lat: number;
    lng: number;
  };
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  trips: {
    completed: number;
    cancelled: number;
  };
  rating: number;
}

export interface Passenger {
  id: string;
  name: string;
  phone: string;
  profilePhoto?: string;
  rating: number;
  tripCount: number;
}

export interface RideRequest {
  id: string;
  passenger: Passenger;
  pickup: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  estimatedFare: number;
  estimatedDistance: number;
  estimatedDuration: number;
  requestedAt: string;
  specialRequests?: string;
  paymentMethod: 'cash' | 'card' | 'digital_wallet';
}

export interface ActiveTrip {
  id: string;
  request: RideRequest;
  status: 'going_to_pickup' | 'arrived_at_pickup' | 'passenger_on_board' | 'completed';
  startedAt: string;
  actualFare?: number;
  actualDistance?: number;
  actualDuration?: number;
}

export interface TripHistory {
  id: string;
  passenger: Passenger;
  pickup: string;
  destination: string;
  fare: number;
  distance: number;
  duration: number;
  completedAt: string;
  rating?: number;
  tip?: number;
  passengerRating?: number;
  passengerFeedback?: string;
}