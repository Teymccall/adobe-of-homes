
// Mock data for charts
export const propertyData = [
  { name: 'Jan', count: 12 },
  { name: 'Feb', count: 19 },
  { name: 'Mar', count: 15 },
  { name: 'Apr', count: 27 },
  { name: 'May', count: 21 },
];

export const propertyTypeData = [
  { name: 'Apartment', value: 35 },
  { name: 'House', value: 45 },
  { name: 'Commercial', value: 10 },
  { name: 'Land', value: 15 },
  { name: 'Townhouse', value: 5 },
];

export const regionData = [
  { name: 'Greater Accra', count: 48 },
  { name: 'Ashanti', count: 35 },
  { name: 'Western', count: 18 },
  { name: 'Eastern', count: 15 },
  { name: 'Central', count: 12 },
  { name: 'Others', count: 27 },
];

export const homeOwnerData = [
  { name: 'Jan', count: 8 },
  { name: 'Feb', count: 12 },
  { name: 'Mar', count: 9 },
  { name: 'Apr', count: 15 },
  { name: 'May', count: 11 },
];

export const homeOwnerPerformanceData = [
  { name: 'Kofi Annan', properties: 15, verified: 12, rating: 4.8 },
  { name: 'Ama Serwaa', properties: 12, verified: 8, rating: 4.5 },
  { name: 'Emmanuel Osei', properties: 8, verified: 6, rating: 4.2 },
  { name: 'Akosua Mensah', properties: 10, verified: 7, rating: 4.6 },
  { name: 'Kwame Asante', properties: 6, verified: 4, rating: 4.3 },
];

export const transactionData = [
  { name: 'Jan', sales: 15, rentals: 28, revenue: 45000 },
  { name: 'Feb', sales: 22, rentals: 35, revenue: 58000 },
  { name: 'Mar', sales: 18, rentals: 31, revenue: 52000 },
  { name: 'Apr', sales: 25, rentals: 42, revenue: 67000 },
  { name: 'May', sales: 20, rentals: 38, revenue: 61000 },
];

// Estate user summary data
export const estateUsersData = [
  { id: 'est-001', name: 'Royal Palms Estate', manager: 'Kwame Asante', units: 120, occupancy: 95, revenue: 45000 },
  { id: 'est-002', name: 'Golden Gate Residences', manager: 'Ama Serwaa', units: 85, occupancy: 78, revenue: 32000 },
  { id: 'est-003', name: 'Sunset Heights', manager: 'Kofi Mensah', units: 60, occupancy: 55, revenue: 28000 },
  { id: 'est-004', name: 'Ocean View Apartments', manager: 'Akosua Osei', units: 150, occupancy: 142, revenue: 68000 },
  { id: 'est-005', name: 'Green Valley Estate', manager: 'Emmanuel Asante', units: 200, occupancy: 185, revenue: 89000 },
];

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const getTimeRangeData = (data: any[], range: string) => {
  // In a real app, this would filter data based on the selected time range
  switch (range) {
    case 'last-week':
      return data.slice(-1);
    case 'current-month':
      return data;
    case 'last-3-months':
      return data;
    case 'last-6-months':
      return data;
    case 'current-year':
      return data;
    default:
      return data;
  }
};
