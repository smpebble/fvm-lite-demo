import React from 'react';
import { TrendingUp, DollarSign, Zap } from 'lucide-react';

interface ValueDashboardProps {
  bondValue: { amount: string; currency: string };
  conversionValue: { amount: string; currency: string } | null;
  accruedInterest: { amount: string; currency: string };
}

const ValueDashboard: React.FC<ValueDashboardProps> = ({ 
  bondValue, 
  conversionValue, 
  accruedInterest 
}) => {
  const formatMoney = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    return {
      formatted: `${currency} ${num.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`,
      value: num
    };
  };

  const bondVal = formatMoney(bondValue.amount, bondValue.currency);
  const accrued = formatMoney(accruedInterest.amount, accruedInterest.currency);
  const convVal = conversionValue 
    ? formatMoney(conversionValue.amount, conversionValue.currency)
    : null;

  const maxValue = Math.max(
    bondVal.value,
    accrued.value,
    convVal?.value || 0
  );

  const ValueBar: React.FC<{
    label: string;
    value: number;
    formatted: string;
    color: string;
    icon: React.ReactNode;
  }> = ({ label, value, formatted, color, icon }) => {
    const percentage = (value / maxValue) * 100;
    
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium text-gray-700">{label}</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{formatted}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-1000 ease-out rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">
          {percentage.toFixed(1)}%
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-3 rounded-xl">
          <TrendingUp className="text-green-600" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Real-Time Valuation</h3>
          <p className="text-sm text-gray-500">Computed with FVM Precision</p>
        </div>
      </div>

      <div className="space-y-2">
        <ValueBar
          label="Bond Present Value"
          value={bondVal.value}
          formatted={bondVal.formatted}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          icon={<DollarSign className="text-blue-600" size={20} />}
        />

        {convVal && (
          <ValueBar
            label="Conversion Value"
            value={convVal.value}
            formatted={convVal.formatted}
            color="bg-gradient-to-r from-green-500 to-green-600"
            icon={<TrendingUp className="text-green-600" size={20} />}
          />
        )}

        <ValueBar
          label="Accrued Interest"
          value={accrued.value}
          formatted={accrued.formatted}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          icon={<Zap className="text-yellow-600" size={20} />}
        />
      </div>

      {/* Precision Highlight */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="bg-indigo-200 p-2 rounded-lg">
            <Zap className="text-indigo-600" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-indigo-900 mb-1">💎 FVM Precision</h4>
            <p className="text-sm text-gray-700 mb-2">
              Exact decimal calculation (18+ digits precision)
            </p>
            <div className="bg-white p-3 rounded-lg font-mono text-xs">
              <div className="text-gray-500 mb-1">Traditional Smart Contracts:</div>
              <div className="text-red-600 mb-2">~{bondVal.formatted} ± $0.50</div>
              <div className="text-gray-500 mb-1">FVM:</div>
              <div className="text-green-600 break-all">
                {bondValue.amount.substring(0, 50)}...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValueDashboard;