import React, { useState, useEffect } from 'react';
import { PlayCircle, Sparkles } from 'lucide-react';
import { api, Bond, BondEvent, StockPrice } from './api';
import BondCard from './components/BondCard';
import ValueDashboard from './components/ValueDashboard';
import Timeline from './components/Timeline';
import CrossChainMonitor from './components/CrossChainMonitor';
import ComparisonTable from './components/ComparisonTable';

interface BondData {
  bond: Bond;
  accrued_interest: { amount: string; currency: string };
  present_value: { amount: string; currency: string };
}

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [bondId, setBondId] = useState<string | null>(null);
  const [bondData, setBondData] = useState<BondData | null>(null);
  const [events, setEvents] = useState<BondEvent[]>([]);
  const [stockPrice, setStockPrice] = useState<StockPrice | null>(null);
  const [conversionValue, setConversionValue] = useState<{ amount: string; currency: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Demo步驟
  const steps = [
    { 
      title: '1. 發行可轉債', 
      subtitle: 'Issue Convertible Bond',
      action: handleIssueBond,
      color: 'bg-blue-500'
    },
    { 
      title: '2. 計算應計利息', 
      subtitle: 'Calculate Accrued Interest',
      action: handleCalculateAccrued,
      color: 'bg-green-500'
    },
    { 
      title: '3. 支付票息', 
      subtitle: 'Pay Coupon',
      action: handlePayCoupon,
      color: 'bg-purple-500'
    },
    { 
      title: '4. 股價上漲', 
      subtitle: 'Stock Price Rise (Cross-Chain)',
      action: handleStockRise,
      color: 'bg-orange-500'
    },
    { 
      title: '5. 自動轉換', 
      subtitle: 'Auto Convert',
      action: handleConvert,
      color: 'bg-red-500'
    },
  ];

  // 定期更新事件
  useEffect(() => {
    const interval = setInterval(async () => {
      if (bondId) {
        const newEvents = await api.getEvents();
        setEvents(newEvents);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [bondId]);

  async function handleIssueBond() {
    setIsLoading(true);
    try {
      const result = await api.createBond({
        principal: 1000000,
        currency: 'USD',
        coupon_rate: 0.05, // 5%
        maturity_years: 5,
        conversion_price: 100,
        conversion_ratio: 10,
      });
      
      setBondId(result.id);
      
      // 獲取債券詳情
      setTimeout(async () => {
        const data = await api.getBond(result.id);
        setBondData(data);
        const newEvents = await api.getEvents();
        setEvents(newEvents);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error issuing bond:', error);
      setIsLoading(false);
    }
  }

  async function handleCalculateAccrued() {
    if (!bondId) return;
    setIsLoading(true);
    try {
      const data = await api.getBond(bondId);
      setBondData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error calculating accrued:', error);
      setIsLoading(false);
    }
  }

  async function handlePayCoupon() {
    if (!bondId) return;
    setIsLoading(true);
    try {
      await api.payCoupon(bondId);
      const data = await api.getBond(bondId);
      setBondData(data);
      const newEvents = await api.getEvents();
      setEvents(newEvents);
      setIsLoading(false);
    } catch (error) {
      console.error('Error paying coupon:', error);
      setIsLoading(false);
    }
  }

  async function handleStockRise() {
    setIsLoading(true);
    try {
      const priceData = await api.getMockStockPrice();
      setStockPrice(priceData);
      
      if (bondId) {
        const valueData = await api.calculateValue(bondId);
        setConversionValue(valueData.conversion_value);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching stock price:', error);
      setIsLoading(false);
    }
  }

  async function handleConvert() {
    if (!bondId || !stockPrice) return;
    setIsLoading(true);
    try {
      await api.convertBond(bondId, parseFloat(stockPrice.price.amount), stockPrice.price.currency);
      const data = await api.getBond(bondId);
      setBondData(data);
      const newEvents = await api.getEvents();
      setEvents(newEvents);
      setIsLoading(false);
    } catch (error) {
      console.error('Error converting bond:', error);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-indigo-600">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="text-indigo-600" size={40} />
                FVM: Financial Virtual Machine
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Precision Financial Computing for Real-World Assets
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Powered by</div>
              <div className="text-xl font-semibold text-indigo-600">Aimichia Technology Co., Ltd.</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Demo Control Panel */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-indigo-100">
          <div className="flex items-center gap-3 mb-6">
            <PlayCircle className="text-indigo-600" size={32} />
            <h2 className="text-3xl font-bold text-gray-900">
              Live Demo: Convertible Bond Lifecycle
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentStep(index);
                  step.action();
                }}
                disabled={isLoading}
                className={`
                  flex-1 min-w-[180px] px-6 py-4 rounded-xl font-semibold text-white
                  transition-all duration-300 transform
                  ${currentStep === index 
                    ? `${step.color} shadow-2xl scale-105 ring-4 ring-offset-2 ring-indigo-300` 
                    : 'bg-gray-300 hover:bg-gray-400 hover:scale-102'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
                `}
              >
                <div className="text-center">
                  <div className="text-lg">{step.title}</div>
                  <div className="text-xs mt-1 opacity-90">{step.subtitle}</div>
                </div>
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-600">Processing...</p>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        {bondData && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <BondCard bond={bondData.bond} />
              <ValueDashboard 
                bondValue={bondData.present_value}
                conversionValue={conversionValue}
                accruedInterest={bondData.accrued_interest}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Timeline events={events} />
              <CrossChainMonitor stockPrice={stockPrice} />
            </div>
          </>
        )}

        {/* Comparison Table */}
        <ComparisonTable />

        {/* Footer Banner */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">
              🎯 Why FVM for Real-World Assets?
            </h3>
            <p className="text-lg opacity-90 mb-4">
              Precision, Performance, and ISO Compliance
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div>
                <div className="text-3xl font-bold">$0.50</div>
                <div className="opacity-80">vs $15-30 on Ethereum</div>
              </div>
              <div>
                <div className="text-3xl font-bold">18+</div>
                <div className="opacity-80">Decimal Precision</div>
              </div>
              <div>
                <div className="text-3xl font-bold">ISO 23257</div>
                <div className="opacity-80">Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;