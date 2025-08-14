export const generateEstatePrintContent = (
  reportType: string,
  selectedSections: Record<string, boolean>,
  selectedTimeRange: string,
  data: any
) => {
  const timeRangeLabel = {
    'last-week': 'Last Week',
    'current-month': 'Current Month',
    'last-3-months': 'Last 3 Months',
    'last-6-months': 'Last 6 Months',
    'current-year': 'Current Year'
  }[selectedTimeRange] || 'Current Month';

  let reportTitle = '';
  let reportData = '';
  
  if (reportType === 'tenants') {
    reportTitle = 'Tenant Management Report';
    
    if (selectedSections.overview) {
      reportData += `
        <div class="stats">
          <div class="stat-card">
            <h3>${data.totalTenants || 0}</h3>
            <p>Total Tenants</p>
          </div>
          <div class="stat-card">
            <h3>${data.activeTenants || 0}</h3>
            <p>Active Tenants</p>
          </div>
          <div class="stat-card">
            <h3>${data.overdueTenants || 0}</h3>
            <p>Overdue Tenants</p>
          </div>
          <div class="stat-card">
            <h3>${data.inactiveTenants || 0}</h3>
            <p>Inactive Tenants</p>
          </div>
        </div>
      `;
    }

    if (selectedSections.active && data.tenants) {
      reportData += `
        <h2>Active Tenants</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Apartment</th>
              <th>Rent</th>
              <th>Lease Period</th>
            </tr>
          </thead>
          <tbody>
            ${data.tenants?.filter((t: any) => t.status === 'active').map((tenant: any) => `
              <tr>
                <td>${tenant.name}</td>
                <td>${tenant.apartment}</td>
                <td>GH₵ ${tenant.rent?.toLocaleString()}</td>
                <td>${tenant.leaseStart} - ${tenant.leaseEnd}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }

    if (selectedSections.inactive && data.tenants) {
      reportData += `
        <h2>Inactive Tenants</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Apartment</th>
              <th>Previous Rent</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.tenants?.filter((t: any) => t.status === 'inactive').map((tenant: any) => `
              <tr>
                <td>${tenant.name}</td>
                <td>${tenant.apartment}</td>
                <td>GH₵ ${tenant.rent?.toLocaleString()}</td>
                <td>Inactive</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }

    if (selectedSections.overdue && data.tenants) {
      reportData += `
        <h2>Overdue Tenants</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Apartment</th>
              <th>Rent</th>
              <th>Days Overdue</th>
            </tr>
          </thead>
          <tbody>
            ${data.tenants?.filter((t: any) => t.status === 'overdue').map((tenant: any) => `
              <tr>
                <td>${tenant.name}</td>
                <td>${tenant.apartment}</td>
                <td>GH₵ ${tenant.rent?.toLocaleString()}</td>
                <td>15+ days</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }
  } else if (reportType === 'payments') {
    reportTitle = 'Payment Management Report';
    
    if (selectedSections.overview) {
      reportData += `
        <div class="stats">
          <div class="stat-card">
            <h3>${data.totalPayments || 0}</h3>
            <p>Total Payments</p>
          </div>
          <div class="stat-card">
            <h3>GH₵ ${data.totalRevenue?.toLocaleString() || 0}</h3>
            <p>Total Revenue</p>
          </div>
          <div class="stat-card">
            <h3>${data.pendingPayments || 0}</h3>
            <p>Pending Payments</p>
          </div>
          <div class="stat-card">
            <h3>${data.overduePayments || 0}</h3>
            <p>Overdue Payments</p>
          </div>
        </div>
      `;
    }

    if (selectedSections.pending && data.payments) {
      reportData += `
        <h2>Pending Payments</h2>
        <table>
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Apartment</th>
              <th>Amount</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            ${data.payments?.filter((p: any) => p.status === 'pending').map((payment: any) => `
              <tr>
                <td>${payment.tenant}</td>
                <td>${payment.apartment}</td>
                <td>GH₵ ${payment.amount?.toLocaleString()}</td>
                <td>${payment.dueDate}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }

    if (selectedSections.paid && data.payments) {
      reportData += `
        <h2>Paid Payments</h2>
        <table>
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Apartment</th>
              <th>Amount</th>
              <th>Paid Date</th>
            </tr>
          </thead>
          <tbody>
            ${data.payments?.filter((p: any) => p.status === 'paid').map((payment: any) => `
              <tr>
                <td>${payment.tenant}</td>
                <td>${payment.apartment}</td>
                <td>GH₵ ${payment.amount?.toLocaleString()}</td>
                <td>${payment.paidDate || 'N/A'}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }

    if (selectedSections.overdue && data.payments) {
      reportData += `
        <h2>Overdue Payments</h2>
        <table>
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Apartment</th>
              <th>Amount</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            ${data.payments?.filter((p: any) => p.status === 'overdue').map((payment: any) => `
              <tr>
                <td>${payment.tenant}</td>
                <td>${payment.apartment}</td>
                <td>GH₵ ${payment.amount?.toLocaleString()}</td>
                <td>${payment.dueDate}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }
  } else if (reportType === 'maintenance') {
    reportTitle = 'Maintenance Requests Report';
    
    if (selectedSections.overview) {
      reportData += `
        <div class="stats">
          <div class="stat-card">
            <h3>${data.totalRequests || 0}</h3>
            <p>Total Requests</p>
          </div>
          <div class="stat-card">
            <h3>${data.pendingRequests || 0}</h3>
            <p>Pending</p>
          </div>
          <div class="stat-card">
            <h3>${data.inProgressRequests || 0}</h3>
            <p>In Progress</p>
          </div>
          <div class="stat-card">
            <h3>${data.completedRequests || 0}</h3>
            <p>Completed</p>
          </div>
        </div>
      `;
    }

    if (selectedSections.pending && data.requests) {
      reportData += `
        <h2>Pending Requests</h2>
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Apartment</th>
              <th>Issue</th>
              <th>Priority</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${data.requests?.filter((r: any) => r.status === 'pending').map((request: any) => `
              <tr>
                <td>${request.id}</td>
                <td>${request.apartment}</td>
                <td>${request.issue}</td>
                <td>${request.priority}</td>
                <td>${request.date}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }

    if (selectedSections.progress && data.requests) {
      reportData += `
        <h2>In Progress Requests</h2>
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Apartment</th>
              <th>Issue</th>
              <th>Assigned To</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${data.requests?.filter((r: any) => r.status === 'in_progress').map((request: any) => `
              <tr>
                <td>${request.id}</td>
                <td>${request.apartment}</td>
                <td>${request.issue}</td>
                <td>${request.assignedTo || 'N/A'}</td>
                <td>${request.date}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }

    if (selectedSections.completed && data.requests) {
      reportData += `
        <h2>Completed Requests</h2>
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Apartment</th>
              <th>Issue</th>
              <th>Completed Date</th>
            </tr>
          </thead>
          <tbody>
            ${data.requests?.filter((r: any) => r.status === 'completed').map((request: any) => `
              <tr>
                <td>${request.id}</td>
                <td>${request.apartment}</td>
                <td>${request.issue}</td>
                <td>${request.completedDate || 'N/A'}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }
  } else if (reportType === 'utilities') {
    reportTitle = 'Utility Bills Report';
    
    if (selectedSections.overview) {
      reportData += `
        <div class="stats">
          <div class="stat-card">
            <h3>${data.totalBills || 0}</h3>
            <p>Total Bills</p>
          </div>
          <div class="stat-card">
            <h3>GH₵ ${data.totalAmount?.toLocaleString() || 0}</h3>
            <p>Total Amount</p>
          </div>
          <div class="stat-card">
            <h3>${data.pendingBills || 0}</h3>
            <p>Pending Bills</p>
          </div>
          <div class="stat-card">
            <h3>${data.overdueBills || 0}</h3>
            <p>Overdue Bills</p>
          </div>
        </div>
      `;
    }

    if (selectedSections.electricity && data.bills) {
      reportData += `
        <h2>Electricity Bills</h2>
        <table>
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Apartment</th>
              <th>Tenant</th>
              <th>Units</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.bills?.filter((b: any) => b.type === 'electricity').map((bill: any) => `
              <tr>
                <td>${bill.id}</td>
                <td>${bill.apartment}</td>
                <td>${bill.tenant}</td>
                <td>${bill.units} kWh</td>
                <td>GH₵ ${bill.amount?.toLocaleString()}</td>
                <td>${bill.status}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }

    if (selectedSections.water && data.bills) {
      reportData += `
        <h2>Water Bills</h2>
        <table>
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Apartment</th>
              <th>Tenant</th>
              <th>Units</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.bills?.filter((b: any) => b.type === 'water').map((bill: any) => `
              <tr>
                <td>${bill.id}</td>
                <td>${bill.apartment}</td>
                <td>${bill.tenant}</td>
                <td>${bill.units} m³</td>
                <td>GH₵ ${bill.amount?.toLocaleString()}</td>
                <td>${bill.status}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }

    if (selectedSections.pending && data.bills) {
      reportData += `
        <h2>Pending Bills</h2>
        <table>
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Type</th>
              <th>Apartment</th>
              <th>Amount</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            ${data.bills?.filter((b: any) => b.status === 'pending').map((bill: any) => `
              <tr>
                <td>${bill.id}</td>
                <td>${bill.type}</td>
                <td>${bill.apartment}</td>
                <td>GH₵ ${bill.amount?.toLocaleString()}</td>
                <td>${bill.dueDate}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }
  } else if (reportType === 'apartments') {
    reportTitle = 'Apartment Overview Report';
    
    if (selectedSections.overview) {
      reportData += `
        <div class="stats">
          <div class="stat-card">
            <h3>${data.totalApartments || 0}</h3>
            <p>Total Apartments</p>
          </div>
          <div class="stat-card">
            <h3>${data.occupiedApartments || 0}</h3>
            <p>Occupied</p>
          </div>
          <div class="stat-card">
            <h3>${data.vacantApartments || 0}</h3>
            <p>Vacant</p>
          </div>
          <div class="stat-card">
            <h3>${data.maintenanceApartments || 0}</h3>
            <p>Under Maintenance</p>
          </div>
        </div>
      `;
    }

    if (selectedSections.occupied && data.apartments) {
      reportData += `
        <h2>Occupied Apartments</h2>
        <table>
          <thead>
            <tr>
              <th>Apartment</th>
              <th>Tenant</th>
              <th>Rent</th>
              <th>Last Payment</th>
            </tr>
          </thead>
          <tbody>
            ${data.apartments?.filter((a: any) => a.status === 'occupied').map((apartment: any) => `
              <tr>
                <td>${apartment.id}</td>
                <td>${apartment.tenant}</td>
                <td>GH₵ ${apartment.rent?.toLocaleString()}</td>
                <td>${apartment.lastPayment || 'N/A'}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }

    if (selectedSections.vacant && data.apartments) {
      reportData += `
        <h2>Vacant Apartments</h2>
        <table>
          <thead>
            <tr>
              <th>Apartment</th>
              <th>Rent</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.apartments?.filter((a: any) => a.status === 'vacant').map((apartment: any) => `
              <tr>
                <td>${apartment.id}</td>
                <td>GH₵ ${apartment.rent?.toLocaleString()}</td>
                <td>Available</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }

    if (selectedSections.maintenance && data.apartments) {
      reportData += `
        <h2>Under Maintenance</h2>
        <table>
          <thead>
            <tr>
              <th>Apartment</th>
              <th>Issue</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.apartments?.filter((a: any) => a.status === 'maintenance').map((apartment: any) => `
              <tr>
                <td>${apartment.id}</td>
                <td>Maintenance Required</td>
                <td>Under Repair</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `;
    }
  }

  return {
    title: reportTitle,
    data: reportData,
    timeRangeLabel
  };
};

export const createEstatePrintWindow = (title: string, data: string, timeRangeLabel: string) => {
  const printContent = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .header { text-align: center; margin-bottom: 20px; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; flex-wrap: wrap; }
          .stat-card { text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin: 5px; min-width: 150px; }
          .stat-card h3 { margin: 0; font-size: 24px; color: #333; }
          .stat-card p { margin: 5px 0 0 0; color: #666; }
          .time-range { text-align: center; margin: 10px 0; font-weight: bold; color: #666; }
          h2 { color: #333; border-bottom: 2px solid #ddd; padding-bottom: 5px; }
          @media print {
            .stats { display: flex; justify-content: space-around; }
            .stat-card { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <div class="time-range">Time Range: ${timeRangeLabel}</div>
        </div>
        ${data}
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }
};

export const generateIndividualTenantReport = (tenant: any) => {
  const reportTitle = `Individual Tenant Report - ${tenant.name}`;
  
  const reportData = `
    <div class="tenant-profile">
      <h2>Tenant Information</h2>
      <table>
        <tbody>
          <tr>
            <td><strong>Name:</strong></td>
            <td>${tenant.name}</td>
          </tr>
          <tr>
            <td><strong>Apartment:</strong></td>
            <td>${tenant.apartment}</td>
          </tr>
          <tr>
            <td><strong>Phone:</strong></td>
            <td>${tenant.phone}</td>
          </tr>
          <tr>
            <td><strong>Email:</strong></td>
            <td>${tenant.email}</td>
          </tr>
          <tr>
            <td><strong>Lease Period:</strong></td>
            <td>${tenant.leaseStart} - ${tenant.leaseEnd}</td>
          </tr>
          <tr>
            <td><strong>Monthly Rent:</strong></td>
            <td>GH₵ ${tenant.rent?.toLocaleString()}</td>
          </tr>
          <tr>
            <td><strong>Status:</strong></td>
            <td>${tenant.status}</td>
          </tr>
          <tr>
            <td><strong>Emergency Contact:</strong></td>
            <td>${tenant.emergencyContact || 'N/A'}</td>
          </tr>
          <tr>
            <td><strong>Deposit:</strong></td>
            <td>GH₵ ${tenant.deposit?.toLocaleString() || 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="payment-history">
      <h2>Payment History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024-06-01</td>
            <td>GH₵ ${tenant.rent?.toLocaleString()}</td>
            <td>Paid</td>
            <td>Bank Transfer</td>
          </tr>
          <tr>
            <td>2024-05-01</td>
            <td>GH₵ ${tenant.rent?.toLocaleString()}</td>
            <td>Paid</td>
            <td>Cash</td>
          </tr>
          <tr>
            <td>2024-04-01</td>
            <td>GH₵ ${tenant.rent?.toLocaleString()}</td>
            <td>Paid</td>
            <td>Mobile Money</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="maintenance-requests">
      <h2>Maintenance Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Issue</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024-06-15</td>
            <td>Leaking faucet in kitchen</td>
            <td>Medium</td>
            <td>Completed</td>
          </tr>
          <tr>
            <td>2024-05-20</td>
            <td>AC not cooling properly</td>
            <td>High</td>
            <td>Completed</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="tenant-notes">
      <h2>Notes & Comments</h2>
      <div class="notes-content">
        <p><strong>General Notes:</strong> Excellent tenant, always pays on time. Very respectful of property.</p>
        <p><strong>Special Requirements:</strong> None</p>
        <p><strong>Last Inspection:</strong> 2024-06-01 - Property in excellent condition</p>
      </div>
    </div>
  `;

  return {
    title: reportTitle,
    data: reportData,
    timeRangeLabel: 'Individual Report'
  };
};

export const createIndividualTenantPrintWindow = (tenant: any) => {
  const { title, data, timeRangeLabel } = generateIndividualTenantReport(tenant);
  
  const printContent = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .tenant-profile, .payment-history, .maintenance-requests, .tenant-notes { margin: 30px 0; }
          .tenant-profile h2, .payment-history h2, .maintenance-requests h2, .tenant-notes h2 { 
            color: #333; 
            border-bottom: 2px solid #ddd; 
            padding-bottom: 5px; 
            margin-bottom: 15px;
          }
          .tenant-profile table td:first-child { font-weight: bold; background-color: #f9f9f9; width: 30%; }
          .notes-content { padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
          .notes-content p { margin: 10px 0; }
          @media print {
            body { margin: 10px; }
            .header { page-break-after: avoid; }
            table { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Report Type: Individual Tenant Profile</p>
        </div>
        ${data}
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }
};
