
import { propertyData, propertyTypeData, regionData, homeOwnerData, homeOwnerPerformanceData, transactionData, getTimeRangeData } from './ReportsDataUtils';

export const generateCustomReport = (
  reportType: string,
  selectedSections: Record<string, boolean>,
  selectedTimeRange: string
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
  
  if (reportType === 'properties') {
    reportTitle = 'Property Analytics Report';
    
    if (selectedSections.overview) {
      reportData += `
        <div class="stats">
          <div class="stat-card">
            <h3>155</h3>
            <p>Total Properties</p>
          </div>
          <div class="stat-card">
            <h3>98</h3>
            <p>Verified Properties</p>
          </div>
          <div class="stat-card">
            <h3>25</h3>
            <p>Pending Verification</p>
          </div>
          <div class="stat-card">
            <h3>GH₵ 215,000</h3>
            <p>Average Price</p>
          </div>
        </div>
      `;
    }

    if (selectedSections.monthly) {
      const filteredData = getTimeRangeData(propertyData, selectedTimeRange);
      reportData += `
        <h2>Property Listings - ${timeRangeLabel}</h2>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.count}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (selectedSections.breakdown) {
      reportData += `
        <h2>Properties by Type</h2>
        <table>
          <thead>
            <tr>
              <th>Property Type</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${propertyTypeData.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.value}</td>
                <td>${((item.value / propertyTypeData.reduce((sum, p) => sum + p.value, 0)) * 100).toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h2>Properties by Region</h2>
        <table>
          <thead>
            <tr>
              <th>Region</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            ${regionData.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.count}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  } else if (reportType === 'homeowners') {
    reportTitle = 'Home Owner Analytics Report';
    
    if (selectedSections.overview) {
      reportData += `
        <div class="stats">
          <div class="stat-card">
            <h3>32</h3>
            <p>Total Home Owners</p>
          </div>
          <div class="stat-card">
            <h3>8</h3>
            <p>New Applications</p>
          </div>
          <div class="stat-card">
            <h3>4.3</h3>
            <p>Average Rating</p>
          </div>
          <div class="stat-card">
            <h3>85%</h3>
            <p>Verification Rate</p>
          </div>
        </div>
      `;
    }

    if (selectedSections.monthly) {
      const filteredData = getTimeRangeData(homeOwnerData, selectedTimeRange);
      reportData += `
        <h2>Home Owner Registrations - ${timeRangeLabel}</h2>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.count}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (selectedSections.performance) {
      reportData += `
        <h2>Top Home Owner Performance</h2>
        <table>
          <thead>
            <tr>
              <th>Home Owner</th>
              <th>Total Properties</th>
              <th>Verified Properties</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            ${homeOwnerPerformanceData.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.properties}</td>
                <td>${item.verified}</td>
                <td>${item.rating}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  } else if (reportType === 'transactions') {
    reportTitle = 'Transaction Analytics Report';
    
    if (selectedSections.overview) {
      reportData += `
        <div class="stats">
          <div class="stat-card">
            <h3>100</h3>
            <p>Total Sales</p>
          </div>
          <div class="stat-card">
            <h3>174</h3>
            <p>Rental Contracts</p>
          </div>
          <div class="stat-card">
            <h3>GH₵ 283,000</h3>
            <p>Total Revenue</p>
          </div>
          <div class="stat-card">
            <h3>12%</h3>
            <p>Growth Rate</p>
          </div>
        </div>
      `;
    }

    if (selectedSections.monthly) {
      const filteredData = getTimeRangeData(transactionData, selectedTimeRange);
      reportData += `
        <h2>Monthly Transaction Summary - ${timeRangeLabel}</h2>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Sales</th>
              <th>Rentals</th>
              <th>Revenue (GH₵)</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.sales}</td>
                <td>${item.rentals}</td>
                <td>${item.revenue.toLocaleString()}</td>
              </tr>
            `).join('')}
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

export const createPrintWindow = (title: string, data: string, timeRangeLabel: string) => {
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
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat-card { text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
          .time-range { text-align: center; margin: 10px 0; font-weight: bold; color: #666; }
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
