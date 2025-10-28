import React from 'react';
import { Link, Activity } from 'lucide-react';
import { StockPrice } from '../api';

interface CrossChainMonitorProps {
  stockPrice: StockPrice | null;
}

const CrossChainMonitor: React.FC<CrossChainMonitorProps> = ({ stockPrice }) => {
  const formatMoney = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    return `${currency} ${num.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 p-3 rounded-xl">
          <Link className="text-orange-600" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Cross-Chain Monitor</h3>
          <p className="text-sm text-gray-500">Real-time data from external chains</p>
        </div>
      </div>

      {stockPrice ? (
        <div className="space-y-4">
          {/* Stock Price Display */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-medium">Current Stock Price</span>
              <Activity className="text-orange-600 animate-pulse" size={20} />
            </div>
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {formatMoney(stockPrice.price.amount, stockPrice.price.currency)}
            </div>
            <div className="text-sm text-gray-600">
              Last updated: {formatTime(stockPrice.timestamp)}
            </div>
          </div>

          {/* Chain Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Source</div>
                <div className="font-semibold text-gray-800">{stockPrice.source}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Chain</div>
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {stockPrice.chain}
                </div>
              </div>
            </div>
          </div>

          {/* Interoperability Highlight */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="bg-blue-200 p-2 rounded-lg">
                <Link className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 mb-1">🌐 Cross-Chain Capability</h4>
                <p className="text-sm text-gray-700">
                  FVM seamlessly integrates with external blockchains through 
                  light client verification and oracle networks.
                </p>
              </div>
            </div>
          </div>

          {/* Data Flow Visualization */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <div className="text-xs font-semibold text-gray-500 mb-3">Data Flow:</div>
            <div className="flex items-center justify-between text-sm">
              <div className="text-center flex-1">
                <div className="bg-orange-100 rounded-lg p-3 mb-2">
                  <div className="font-semibold text-orange-800">Ethereum</div>
                </div>
                <div className="text-xs text-gray-500">Source Chain</div>
              </div>
              
              <div className="flex-shrink-0 px-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
                  <div className="text-indigo-400">→</div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
                </div>
              </div>
              
              <div className="text-center flex-1">
                <div className="bg-indigo-100 rounded-lg p-3 mb-2">
                  <div className="font-semibold text-indigo-800">FVM</div>
                </div>
                <div className="text-xs text-gray-500">Processing</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Link size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">Waiting for cross-chain data...</p>
          <p className="text-sm mt-2">Click "Stock Price Rise" to fetch data</p>
        </div>
      )}
    </div>
  );
};

export default CrossChainMonitor;