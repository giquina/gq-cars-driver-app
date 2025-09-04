export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleModel: string;
  vehiclePlate: string;
  status: 'active' | 'inactive' | 'suspended';
  dateJoined: string;
  earnings: {
    total: number;
    thisMonth: number;
    thisWeek: number;
  };
  trips: {
    total: number;
    thisMonth: number;
    thisWeek: number;
  };
  rating: number;
}

export interface Trip {
  id: string;
  driverId: string;
  fare: number;
  distance: number;
  duration: number;
  date: string;
  status: 'completed' | 'cancelled';
}

export interface DashboardMetrics {
  totalDrivers: number;
  activeDrivers: number;
  totalEarnings: number;
  totalTrips: number;
  averageRating: number;
}