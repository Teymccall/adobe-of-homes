
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UtilityBill, getUtilityIcon, getStatusBadge } from './UtilityHelpers';

interface UtilityBillsTableProps {
  bills: UtilityBill[];
  onViewBill: (billId: string) => void;
  onSendBill: (billId: string) => void;
}

const UtilityBillsTable = ({ bills, onViewBill, onSendBill }: UtilityBillsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Utility Bills</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill ID</TableHead>
              <TableHead>Apartment</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Utility Type</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="font-medium">{bill.id}</TableCell>
                <TableCell>
                  <Badge variant="outline">{bill.apartment}</Badge>
                </TableCell>
                <TableCell>{bill.tenant}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getUtilityIcon(bill.type)}
                    <span className="capitalize">{bill.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{bill.units} units</div>
                    <div className="text-sm text-muted-foreground">{bill.meterReading}</div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  GH₵ {bill.amount.toLocaleString()}
                </TableCell>
                <TableCell>{bill.dueDate}</TableCell>
                <TableCell>{getStatusBadge(bill.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onViewBill(bill.id)}
                    >
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onSendBill(bill.id)}
                    >
                      Send
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UtilityBillsTable;
