
import { Zap, Droplets, Wifi, Trash2 } from 'lucide-react';

export const getUtilityIcon = (type: string) => {
  switch (type) {
    case 'electricity':
      return <Zap size={16} className="text-yellow-500" />;
    case 'water':
      return <Droplets size={16} className="text-blue-500" />;
    case 'internet':
      return <Wifi size={16} className="text-purple-500" />;
    case 'waste':
      return <Trash2 size={16} className="text-green-500" />;
    default:
      return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
  }
};

export const getUtilityUnit = (type: string) => {
  switch (type) {
    case 'electricity':
      return 'kWh';
    case 'water':
      return 'm³';
    case 'internet':
      return 'GB';
    case 'waste':
      return 'service';
    default:
      return 'units';
  }
};

export const getDefaultRate = (type: string) => {
  switch (type) {
    case 'electricity':
      return '1.45';
    case 'water':
      return '12.50';
    case 'internet':
      return '150.00';
    case 'waste':
      return '80.00';
    default:
      return '0.00';
  }
};

export const calculateAmount = (units: string, rate: string) => {
  const unitsNum = parseFloat(units) || 0;
  const rateNum = parseFloat(rate) || 0;
  return (unitsNum * rateNum).toFixed(2);
};
