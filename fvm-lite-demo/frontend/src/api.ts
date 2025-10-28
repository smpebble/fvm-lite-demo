const API_BASE = 'http://localhost:3001/api';

export interface Bond {
  id: string;
  principal: Money;
  coupon_rate: Rate;
  issue_date: string;
  maturity_date: string;
  conversion_price: Money;
  conversion_ratio: number;
  state: string;
  last_coupon_date: string;
}

export interface Money {
  amount: string;
  currency: string;
}

export interface Rate {
  value: string;
}

export interface BondEvent {
  type: string;
  bond_id: string;
  timestamp: string;
  data?: any;
}

export interface StockPrice {
  price: Money;
  source: string;
  chain: string;
  timestamp: string;
}

export const api = {
  async createBond(params: {
    principal: number;
    currency: string;
    coupon_rate: number;
    maturity_years: number;
    conversion_price: number;
    conversion_ratio: number;
  }) {
    const response = await fetch(`${API_BASE}/bonds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },

  async getBond(id: string) {
    const response = await fetch(`${API_BASE}/bonds/${id}`);
    return response.json();
  },

  async payCoupon(id: string) {
    const response = await fetch(`${API_BASE}/bonds/${id}/coupon`, {
      method: 'POST',
    });
    return response.json();
  },

  async convertBond(id: string, stockPrice: number, currency: string) {
    const response = await fetch(`${API_BASE}/bonds/${id}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock_price: stockPrice, currency }),
    });
    return response.json();
  },

  async calculateValue(id: string) {
    const response = await fetch(`${API_BASE}/bonds/${id}/value`);
    return response.json();
  },

  async getEvents(): Promise<BondEvent[]> {
    const response = await fetch(`${API_BASE}/events`);
    return response.json();
  },

  async getMockStockPrice(): Promise<StockPrice> {
    const response = await fetch(`${API_BASE}/mock-stock-price`);
    return response.json();
  },
};