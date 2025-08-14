
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Tenant {
  id: string;
  name: string;
  unit: string;
  rent: number;
  status: string;
  arrears: number;
}

interface EstateTenantTableProps {
  tenantData: Tenant[];
}

const EstateTenantTable = ({ tenantData }: EstateTenantTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Information</CardTitle>
        <CardDescription>Current tenant status and payment details</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Monthly Rent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Arrears</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenantData.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell>{tenant.unit}</TableCell>
                <TableCell>GH₵ {tenant.rent.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tenant.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tenant.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={tenant.arrears > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                    GH₵ {tenant.arrears.toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EstateTenantTable;
