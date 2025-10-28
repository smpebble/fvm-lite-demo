import React from 'react';
import { FileText, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Bond } from '../api';

interface BondCardProps {
  bond: Bond;
}

const BondCard: React.FC<BondCardProps> = ({ bond }) => {
  const formatMoney = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    return `${currency} ${num.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRate = (rate: string) => {
    return `${(parseFloat(rate) * 100).toFixed(2)}%`;
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'matured': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-100 hover:shadow-2xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <FileText className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Convertible Bond</h3>
            <p className="text-sm text-gray-500">ID: {bond.id.substring(0, 8)}...</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStateColor(bond.state)}`}>
          {bond.state.toUpperCase()}
        </span>
      </div>

      <div className="space-y-4">
        {/* Principal */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-3">
            <DollarSign className="text-blue-600" size={20} />
            <span className="text-gray-700 font-medium">Principal</span>
          </div>
          <span className="text-xl font-bold text-blue-600">
            {formatMoney(bond.principal.amount, bond.principal.currency)}
          </span>
        </div>

        {/* Coupon Rate */}
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-600" size={20} />
            <span className="text-gray-700 font-medium">Coupon Rate</span>
          </div>
          <span className="text-xl font-bold text-green-600">
            {formatRate(bond.coupon_rate.value)}
          </span>
        </div>

        {/* Conversion Terms */}
        <div className="p-4 bg-purple-50 rounded-xl">
          <div className="font-medium text-gray-700 mb-2">Conversion Terms</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Price:</span>
              <span className="ml-2 font-semibold text-purple-600">
                {formatMoney(bond.conversion_price.amount, bond.conversion_price.currency)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Ratio:</span>
              <span className="ml-2 font-semibold text-purple-600">
                {bond.conversion_ratio}:1
              </span>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-gray-600" size={16} />
              <span className="text-sm text-gray-600">Issue Date</span>
            </div>
            <div className="font-semibold text-gray-800">
              {formatDate(bond.issue_date)}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-gray-600" size={16} />
              <span className="text-sm text-gray-600">Maturity Date</span>
            </div>
            <div className="font-semibold text-gray-800">
              {formatDate(bond.maturity_date)}
            </div>
          </div>
        </div>
      </div>

      {/* FVM Badge */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Computed by</span>
          <span className="text-sm font-semibold text-indigo-600">FVM Engine</span>
        </div>
      </div>
    </div>
  );
};

export default BondCard;