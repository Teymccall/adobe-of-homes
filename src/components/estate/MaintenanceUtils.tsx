
export const mockMaintenanceRequests = [
  {
    id: 'MNT001',
    apartment: 'A101',
    tenant: 'John Doe',
    issue: 'Leaking Faucet',
    category: 'plumbing',
    priority: 'medium',
    status: 'pending',
    dateRequested: '2024-06-15',
    assignedTo: null,
    estimatedCost: 150,
    description: 'Kitchen faucet has been dripping for the past week'
  },
  {
    id: 'MNT002',
    apartment: 'A103',
    tenant: 'Jane Smith',
    issue: 'Power Outlet Not Working',
    category: 'electrical',
    priority: 'high',
    status: 'in_progress',
    dateRequested: '2024-06-14',
    assignedTo: 'Electrician Sam',
    estimatedCost: 250,
    description: 'Living room power outlet stopped working suddenly'
  },
  {
    id: 'MNT003',
    apartment: 'A104',
    tenant: 'Mike Johnson',
    issue: 'Air Conditioning Unit',
    category: 'hvac',
    priority: 'high',
    status: 'completed',
    dateRequested: '2024-06-10',
    assignedTo: 'HVAC Tech John',
    estimatedCost: 500,
    description: 'AC unit not cooling properly, needs maintenance'
  },
  {
    id: 'MNT004',
    apartment: 'A106',
    tenant: 'Sarah Wilson',
    issue: 'Broken Door Handle',
    category: 'general',
    priority: 'low',
    status: 'pending',
    dateRequested: '2024-06-16',
    assignedTo: null,
    estimatedCost: 80,
    description: 'Bedroom door handle is loose and needs replacement'
  }
];

export const filterMaintenanceRequests = (requests: any[], searchTerm: string) => {
  return requests.filter(request =>
    request.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
