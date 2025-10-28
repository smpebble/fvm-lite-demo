# FVM: Financial Virtual Machine

A proof-of-concept Financial Virtual Machine for Real-World Asset (RWA) tokenization, featuring convertible bond lifecycle management.

## 🎯 Demo for RWA Hackathon Taiwan 2025

This project demonstrates:
- ✅ Financial-grade precision computing (18+ decimal places)
- ✅ Convertible bond lifecycle management
- ✅ Cross-chain interoperability (simulated)
- ✅ ISO 23257 compliance architecture
- ✅ CDM/FpML integration concepts

## 🏗️ Architecture
```
FVM Stack:
├── Financial Type System (Money, Rate, etc.)
├── Bond Logic Engine
├── Valuation Calculator
└── Cross-Chain Integration Layer
```

## 🚀 Quick Start

### Prerequisites
- Go 1.21+
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/smpebble/fvm-lite-demo.git
cd fvm-lite-demo
```

2. Start Backend (Terminal 1):
```bash
cd backend
go mod tidy
go run main.go
```

3. Start Frontend (Terminal 2):
```bash
cd frontend
npm install
npm run dev
```

4. Open browser:
```
http://localhost:5173
```

## 🎬 Demo Walkthrough

Follow the 5-step demo:
1. **Issue Bond** - Create a convertible bond
2. **Calculate Interest** - See real-time accrued interest
3. **Pay Coupon** - Execute coupon payment
4. **Stock Rise** - Simulate cross-chain stock price fetch
5. **Convert** - Automatic bond-to-equity conversion

## 🔧 Tech Stack

**Backend:**
- Go 1.21
- shopspring/decimal (financial precision)
- Native HTTP server

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts

## 📊 Key Features

| Feature | FVM | Traditional SC |
|---------|-----|----------------|
| Precision | 18+ decimals | ~6-8 decimals |
| Financial Functions | Built-in | Manual |
| Gas Cost | $0.50 | $15-30 |
| ISO Compliance | ✅ | ❌ |

## 🎯 Use Cases

- Convertible Bonds
- Asset-Backed Securities
- Derivatives
- Structured Products
- Cross-border Settlements

## 📄 License

MIT License

## 🏆 Hackathon Info

- Event: RWA Hackathon Taiwan 2025
- Category: DeFi Infrastructure
