
export const mockTenantData = [
  {
    id: 'T001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+233 24 123 4567',
    apartment: 'A101',
    leaseStart: '2024-01-01',
    leaseEnd: '2024-12-31',
    rent: 2500,
    deposit: 5000,
    status: 'active'
  },
  {
    id: 'T002',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+233 24 234 5678',
    apartment: 'A103',
    leaseStart: '2024-02-01',
    leaseEnd: '2025-01-31',
    rent: 2800,
    deposit: 5600,
    status: 'active'
  },
  {
    id: 'T003',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '+233 24 345 6789',
    apartment: 'A104',
    leaseStart: '2023-12-01',
    leaseEnd: '2024-11-30',
    rent: 3000,
    deposit: 6000,
    status: 'overdue'
  },
  {
    id: 'T004',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+233 24 456 7890',
    apartment: 'A106',
    leaseStart: '2024-03-01',
    leaseEnd: '2025-02-28',
    rent: 2700,
    deposit: 5400,
    status: 'active'
  },
  {
    id: 'T005',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '+233 24 567 8901',
    apartment: 'A107',
    leaseStart: '2023-06-01',
    leaseEnd: '2024-05-31',
    rent: 2900,
    deposit: 5800,
    status: 'inactive'
  }
];

export const filterTenants = (tenants: any[], searchTerm: string, showInactive: boolean = false) => {
  let filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!showInactive) {
    filteredTenants = filteredTenants.filter(tenant => tenant.status !== 'inactive');
  }

  return filteredTenants;
};
