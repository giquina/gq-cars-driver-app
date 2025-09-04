import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "@phosphor-icons/react";
import { Driver } from "@/types";

interface DriverFormProps {
  driver?: Driver;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (driver: Omit<Driver, 'id'>) => void;
}

export function DriverForm({ driver, isOpen, onOpenChange, onSubmit }: DriverFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    vehicleModel: "",
    vehiclePlate: "",
    status: "active" as Driver['status'],
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        licenseNumber: driver.licenseNumber,
        vehicleModel: driver.vehicleModel,
        vehiclePlate: driver.vehiclePlate,
        status: driver.status,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        licenseNumber: "",
        vehicleModel: "",
        vehiclePlate: "",
        status: "active",
      });
    }
  }, [driver, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDriver = {
      ...formData,
      dateJoined: driver?.dateJoined || new Date().toISOString().split('T')[0],
      earnings: driver?.earnings || {
        total: 0,
        thisMonth: 0,
        thisWeek: 0,
      },
      trips: driver?.trips || {
        total: 0,
        thisMonth: 0,
        thisWeek: 0,
      },
      rating: driver?.rating || 5.0,
    };

    onSubmit(newDriver);
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {driver ? "Edit Driver" : "Add New Driver"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License Number</Label>
              <Input
                id="license"
                value={formData.licenseNumber}
                onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                placeholder="DL123456789"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-model">Vehicle Model</Label>
              <Input
                id="vehicle-model"
                value={formData.vehicleModel}
                onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
                placeholder="Toyota Camry 2020"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-plate">License Plate</Label>
              <Input
                id="vehicle-plate"
                value={formData.vehiclePlate}
                onChange={(e) => handleInputChange("vehiclePlate", e.target.value)}
                placeholder="ABC123"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: Driver['status']) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {driver ? "Update Driver" : "Add Driver"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface AddDriverButtonProps {
  onAddDriver: (driver: Omit<Driver, 'id'>) => void;
}

export function AddDriverButton({ onAddDriver }: AddDriverButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus size={16} />
        Add Driver
      </Button>
      <DriverForm
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={onAddDriver}
      />
    </>
  );
}