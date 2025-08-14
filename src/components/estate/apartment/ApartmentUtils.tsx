
export const mockApartmentData = [
  {
    id: 'A101',
    tenant: 'John Doe',
    rent: 2500,
    status: 'occupied',
    lastPayment: '2024-06-15',
    phone: '+233 24 123 4567'
  },
  {
    id: 'A102',
    tenant: null,
    rent: 2500,
    status: 'vacant',
    lastPayment: null,
    phone: null
  },
  {
    id: 'A103',
    tenant: 'Jane Smith',
    rent: 2800,
    status: 'occupied',
    lastPayment: '2024-06-10',
    phone: '+233 24 234 5678'
  },
  {
    id: 'A104',
    tenant: 'Mike Johnson',
    rent: 3000,
    status: 'overdue',
    lastPayment: '2024-05-15',
    phone: '+233 24 345 6789'
  },
  {
    id: 'A105',
    tenant: null,
    rent: 2500,
    status: 'vacant',
    lastPayment: null,
    phone: null
  },
  {
    id: 'A106',
    tenant: 'Sarah Wilson',
    rent: 2700,
    status: 'occupied',
    lastPayment: '2024-06-12',
    phone: '+233 24 456 7890'
  }
];

export const mockStats = {
  totalApartments: 6,
  occupiedApartments: 4,
  vacantApartments: 2,
  totalRevenue: 13500,
  pendingPayments: 3000,
  maintenanceRequests: 3
};

export const filterApartments = (apartments: any[], searchTerm: string) => {
  return apartments.filter(apartment =>
    apartment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (apartment.tenant && apartment.tenant.toLowerCase().includes(searchTerm.toLowerCase())) ||
    apartment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
