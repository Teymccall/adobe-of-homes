
import React from 'react';
import EstateUserDetailHeader from './estate/EstateUserDetailHeader';
import EstateOverviewStats from './estate/EstateOverviewStats';
import EstateChartsSection from './estate/EstateChartsSection';
import EstateOccupancyChart from './estate/EstateOccupancyChart';
import EstateTenantTable from './estate/EstateTenantTable';
import { getEstateUserData } from './estate/EstateUserDetailData';

interface EstateUserDetailReportsProps {
  userId: string;
  onBack: () => void;
  onPrintReport: (reportType: string) => void;
}

const EstateUserDetailReports = ({ userId, onBack, onPrintReport }: EstateUserDetailReportsProps) => {
  const estateData = getEstateUserData(userId);

  return (
    <div className="space-y-6">
      <EstateUserDetailHeader
        estateName={estateData.name}
        estateManager={estateData.manager}
        userId={userId}
        onBack={onBack}
        onPrintReport={onPrintReport}
      />

      <EstateOverviewStats
        totalUnits={estateData.totalUnits}
        occupiedUnits={estateData.occupiedUnits}
        monthlyRevenue={estateData.monthlyRevenue}
        maintenanceRequests={estateData.maintenanceRequests}
      />

      <EstateChartsSection
        monthlyData={estateData.monthlyData}
        unitTypes={estateData.unitTypes}
      />

      <EstateOccupancyChart
        monthlyData={estateData.monthlyData}
      />

      <EstateTenantTable
        tenantData={estateData.tenantData}
      />
    </div>
  );
};

export default EstateUserDetailReports;
