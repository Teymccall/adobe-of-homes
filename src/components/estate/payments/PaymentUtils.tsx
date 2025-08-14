
export const mockPaymentData = [
  {
    id: 'PAY001',
    tenant: 'John Doe',
    apartment: 'A101',
    amount: 2500,
    type: 'rent',
    dueDate: '2024-06-01',
    paidDate: '2024-06-01',
    status: 'paid',
    method: 'bank_transfer'
  },
  {
    id: 'PAY002',
    tenant: 'Jane Smith',
    apartment: 'A103',
    amount: 2800,
    type: 'rent',
    dueDate: '2024-06-01',
    paidDate: '2024-06-02',
    status: 'paid',
    method: 'mobile_money'
  },
  {
    id: 'PAY003',
    tenant: 'Mike Johnson',
    apartment: 'A104',
    amount: 3000,
    type: 'rent',
    dueDate: '2024-06-01',
    paidDate: null,
    status: 'overdue',
    method: null
  },
  {
    id: 'PAY004',
    tenant: 'Sarah Wilson',
    apartment: 'A106',
    amount: 2700,
    type: 'rent',
    dueDate: '2024-06-01',
    paidDate: null,
    status: 'pending',
    method: null
  },
  {
    id: 'PAY005',
    tenant: 'John Doe',
    apartment: 'A101',
    amount: 500,
    type: 'maintenance',
    dueDate: '2024-06-15',
    paidDate: null,
    status: 'pending',
    method: null
  }
];

export const filterPayments = (payments: any[], searchTerm: string) => {
  return payments.filter(payment =>
    payment.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
