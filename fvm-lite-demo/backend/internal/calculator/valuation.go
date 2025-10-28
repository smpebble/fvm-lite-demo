package calculator

import (
	"fvm-lite-demo/internal/bond"
	"fvm-lite-demo/internal/types"
	"github.com/shopspring/decimal"
	"math"
	"time"
)

// CalculatePresentValue 計算現值（簡化DCF方法）
func CalculatePresentValue(
	b *bond.ConvertibleBond,
	marketRate types.Rate,
	currentDate time.Time,
) types.Money {
	// 計算到期年數
	duration := b.MaturityDate.Sub(currentDate)
	yearsToMaturity := duration.Hours() / 24 / 365

	if yearsToMaturity <= 0 {
		return b.Principal
	}

	// 年度票息
	annualCoupon := b.Principal.Amount.Mul(b.CouponRate.Value)

	// 簡化計算：假設每年付息一次
	pv := decimal.Zero

	// 計算每期票息的現值
	for year := 1; year <= int(yearsToMaturity)+1; year++ {
		discountFactor := math.Pow(
			1+marketRate.Value.InexactFloat64(),
			-float64(year),
		)
		pv = pv.Add(annualCoupon.Mul(decimal.NewFromFloat(discountFactor)))
	}

	// 加上本金現值
	finalDiscountFactor := math.Pow(
		1+marketRate.Value.InexactFloat64(),
		-yearsToMaturity,
	)
	pv = pv.Add(b.Principal.Amount.Mul(decimal.NewFromFloat(finalDiscountFactor)))

	return types.Money{
		Amount:   pv,
		Currency: b.Principal.Currency,
	}
}

// CalculateBondPrice 計算債券價格（簡化版）
func CalculateBondPrice(
	b *bond.ConvertibleBond,
	marketRate types.Rate,
	currentDate time.Time,
) types.Money {
	// 在Demo中，我們使用現值作為債券價格
	return CalculatePresentValue(b, marketRate, currentDate)
}