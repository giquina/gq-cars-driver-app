import { useState } from "react";
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DashboardOverview } from "@/components/DashboardOverview";
import { DriverTable } from "@/components/DriverTable";
import { AddDriverButton, DriverForm } from "@/components/DriverForm";
import { EarningsChart, DriverStatusChart, TopDriversChart } from "@/components/Charts";
import { Driver } from "@/types";
import { Car, ChartLine, Users } from "@phosphor-icons/react";

function App() {
  const [drivers, setDrivers] = useKV<Driver[]>("drivers", []);
  const [editingDriver, setEditingDriver] = useState<Driver | undefined>();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const calculateMetrics = () => {
    const totalDrivers = drivers.length;
    const activeDrivers = drivers.filter(d => d.status === 'active').length;
    const totalEarnings = drivers.reduce((sum, d) => sum + d.earnings.total, 0);
    const totalTrips = drivers.reduce((sum, d) => sum + d.trips.total, 0);
    const averageRating = drivers.length > 0 
      ? drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length 
      : 0;

    return {
      totalDrivers,
      activeDrivers,
      totalEarnings,
      totalTrips,
      averageRating,
    };
  };

  const handleAddDriver = (driverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: generateId(),
    };

    setDrivers(currentDrivers => [...currentDrivers, newDriver]);
    toast.success("Driver added successfully!");
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setIsEditFormOpen(true);
  };

  const handleUpdateDriver = (driverData: Omit<Driver, 'id'>) => {
    if (!editingDriver) return;

    const updatedDriver: Driver = {
      ...driverData,
      id: editingDriver.id,
    };

    setDrivers(currentDrivers => 
      currentDrivers.map(d => d.id === editingDriver.id ? updatedDriver : d)
    );
    toast.success("Driver updated successfully!");
    setEditingDriver(undefined);
  };

  const handleDeleteDriver = (driverId: string) => {
    setDrivers(currentDrivers => currentDrivers.filter(d => d.id !== driverId));
    toast.success("Driver deleted successfully!");
  };

  const handleUpdateStatus = (driverId: string, status: Driver['status']) => {
    setDrivers(currentDrivers =>
      currentDrivers.map(d => 
        d.id === driverId ? { ...d, status } : d
      )
    );
    toast.success(`Driver status updated to ${status}!`);
  };

  const metrics = calculateMetrics();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Car size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">GQ Cars</h1>
              <p className="text-muted-foreground">Driver Management System</p>
            </div>
          </div>
          <AddDriverButton onAddDriver={handleAddDriver} />
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <ChartLine size={16} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center gap-2">
              <Users size={16} />
              Drivers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <ChartLine size={16} />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardOverview metrics={metrics} />
            
            {drivers.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Car size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Drivers Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Get started by adding your first driver to the system.
                  </p>
                  <AddDriverButton onAddDriver={handleAddDriver} />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                <EarningsChart />
                <DriverStatusChart />
              </div>
            )}
          </TabsContent>

          <TabsContent value="drivers">
            <DriverTable 
              drivers={drivers}
              onEditDriver={handleEditDriver}
              onDeleteDriver={handleDeleteDriver}
              onUpdateStatus={handleUpdateStatus}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {drivers.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <ChartLine size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Analytics Data</h3>
                  <p className="text-muted-foreground mb-6">
                    Add drivers and record trips to see analytics and insights.
                  </p>
                  <AddDriverButton onAddDriver={handleAddDriver} />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <EarningsChart />
                  <DriverStatusChart />
                </div>
                <TopDriversChart />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DriverForm
          driver={editingDriver}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSubmit={handleUpdateDriver}
        />
      </div>
    </div>
  );
}

export default App;