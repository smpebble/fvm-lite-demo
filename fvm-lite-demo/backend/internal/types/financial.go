package types

import (
	"github.com/shopspring/decimal"
)

// Money 代表精確的貨幣金額
type Money struct {
	Amount   decimal.Decimal `json:"amount"`
	Currency string          `json:"currency"`
}

// NewMoney 創建Money
func NewMoney(amount float64, currency string) Money {
	return Money{
		Amount:   decimal.NewFromFloat(amount),
		Currency: currency,
	}
}

// Rate 代表利率
type Rate struct {
	Value decimal.Decimal `json:"value"` // 0.05 表示 5%
}

// NewRate 創建Rate
func NewRate(value float64) Rate {
	return Rate{
		Value: decimal.NewFromFloat(value),
	}
}

// BondState 債券狀態
type BondState string

const (
	StateActive    BondState = "active"
	StateConverted BondState = "converted"
	StateMatured   BondState = "matured"
)

// Add 金額相加
func (m Money) Add(other Money) Money {
	return Money{
		Amount:   m.Amount.Add(other.Amount),
		Currency: m.Currency,
	}
}

// Mul 金額乘以係數
func (m Money) Mul(multiplier decimal.Decimal) Money {
	return Money{
		Amount:   m.Amount.Mul(multiplier),
		Currency: m.Currency,
	}
}

// GreaterThan 比較大小
func (m Money) GreaterThan(other Money) bool {
	return m.Amount.GreaterThan(other.Amount)
}