import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { BondEvent } from '../api';

interface TimelineProps {
  events: BondEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getEventIcon = (type: string) => {
    return <CheckCircle className="text-green-500" size={20} />;
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'issued': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'coupon_paid': return 'bg-green-100 border-green-300 text-green-800';
      case 'converted': return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getEventTitle = (type: string) => {
    const titles: Record<string, string> = {
      'issued': 'Bond Issued',
      'coupon_paid': 'Coupon Paid',
      'converted': 'Bond Converted',
    };
    return titles[type] || type;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-xl">
          <Clock className="text-blue-600" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Event Timeline</h3>
          <p className="text-sm text-gray-500">Bond lifecycle events</p>
        </div>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Clock size={48} className="mx-auto mb-4 opacity-50" />
            <p>No events yet. Start the demo!</p>
          </div>
        ) : (
          events.map((event, index) => (
            <div
              key={index}
              className={`relative pl-8 pb-4 border-l-2 ${
                index === events.length - 1 ? 'border-transparent' : 'border-gray-200'
              }`}
            >
              <div className="absolute left-[-11px] top-0">
                {getEventIcon(event.type)}
              </div>
              
              <div className={`p-4 rounded-xl border-2 ${getEventColor(event.type)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">
                    {getEventTitle(event.type)}
                  </span>
                  <span className="text-xs opacity-75">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
                
                {event.data && (
                  <div className="text-xs mt-2 p-2 bg-white bg-opacity-50 rounded">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(event.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Timeline;