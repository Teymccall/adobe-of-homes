
// Mock data for estate user details
export const getEstateUserData = (userId: string) => {
  const estates = {
    'est-001': {
      name: 'Royal Palms Estate',
      manager: 'Kwame Asante',
      totalUnits: 120,
      occupiedUnits: 95,
      monthlyRevenue: 45000,
      maintenanceRequests: 8,
      monthlyData: [
        { month: 'Jan', revenue: 38000, occupancy: 85, maintenance: 12 },
        { month: 'Feb', revenue: 42000, occupancy: 88, maintenance: 9 },
        { month: 'Mar', revenue: 45000, occupancy: 92, maintenance: 7 },
        { month: 'Apr', revenue: 47000, occupancy: 95, maintenance: 8 },
        { month: 'May', revenue: 45000, occupancy: 95, maintenance: 8 },
      ],
      unitTypes: [
        { name: '1 Bedroom', count: 40, occupied: 35 },
        { name: '2 Bedroom', count: 50, occupied: 42 },
        { name: '3 Bedroom', count: 30, occupied: 18 },
      ],
      tenantData: [
        { id: 'T001', name: 'Ama Serwaa', unit: 'A-101', rent: 800, status: 'Active', arrears: 0 },
        { id: 'T002', name: 'Kofi Mensah', unit: 'B-205', rent: 1200, status: 'Active', arrears: 0 },
        { id: 'T003', name: 'Akosua Osei', unit: 'C-301', rent: 1500, status: 'Pending', arrears: 400 },
        { id: 'T004', name: 'Emmanuel Asante', unit: 'A-102', rent: 800, status: 'Active', arrears: 0 },
        { id: 'T005', name: 'Abena Gyasi', unit: 'B-103', rent: 1200, status: 'Active', arrears: 200 },
      ]
    }
  };

  return estates[userId as keyof typeof estates] || estates['est-001'];
};
