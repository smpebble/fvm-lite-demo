import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const ComparisonTable: React.FC = () => {
  const comparisons = [
    {
      feature: 'Float-point Precision',
      fvm: { status: true, detail: 'Arbitrary Precision (18+ digits)' },
      solidity: { status: false, detail: 'Integer Only (approximation required)' },
    },
    {
      feature: 'Built-in Financial Functions',
      fvm: { status: true, detail: 'NPV, IRR, Day Count, etc.' },
      solidity: { status: false, detail: 'Manual Implementation Required' },
    },
    {
      feature: 'Transaction Cost (Lifecycle)',
      fvm: { status: true, detail: '$0.50 average' },
      solidity: { status: false, detail: '$15-30 average' },
    },
    {
      feature: 'CDM/FpML Support',
      fvm: { status: true, detail: 'Native Integration' },
      solidity: { status: false, detail: 'No Standard Support' },
    },
    {
      feature: 'ISO 23257 Compliance',
      fvm: { status: true, detail: 'Full Compliance' },
      solidity: { status: false, detail: 'Not Applicable' },
    },
    {
      feature: 'Cross-Chain Interoperability',
      fvm: { status: true, detail: 'Built-in Support' },
      solidity: { status: false, detail: 'Requires External Bridges' },
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-indigo-100">
      <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        ⚖️ FVM vs Traditional Smart Contracts
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="px-6 py-4 text-left text-lg font-semibold text-gray-700">
                Feature
              </th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-indigo-600">
                FVM (Golang)
              </th>
              <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600">
                Solidity (EVM)
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((row, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {row.feature}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-green-700">
                        {row.fvm.detail}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-red-700">
                        {row.solidity.detail}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <div className="text-4xl font-bold text-green-600 mb-2">30x</div>
          <div className="text-sm text-gray-700">Cost Reduction</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
          <div className="text-sm text-gray-700">Precision Accuracy</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <div className="text-4xl font-bold text-purple-600 mb-2">ISO</div>
          <div className="text-sm text-gray-700">Standard Compliant</div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;