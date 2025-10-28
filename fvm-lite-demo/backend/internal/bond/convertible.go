package bond

import (
	"fvm-lite-demo/internal/types"
	"github.com/shopspring/decimal"
	"time"
)

// ConvertibleBond 可轉債
type ConvertibleBond struct {
	ID              string          `json:"id"`
	Principal       types.Money     `json:"principal"`
	CouponRate      types.Rate      `json:"coupon_rate"`
	IssueDate       time.Time       `json:"issue_date"`
	MaturityDate    time.Time       `json:"maturity_date"`
	ConversionPrice types.Money     `json:"conversion_price"`
	ConversionRatio decimal.Decimal `json:"conversion_ratio"`
	State           types.BondState `json:"state"`
	LastCouponDate  time.Time       `json:"last_coupon_date"`
}

// AccruedInterest 計算應計利息（ACT/360日計算法）
func (b *ConvertibleBond) AccruedInterest(currentDate time.Time) types.Money {
	// 計算天數
	days := int(currentDate.Sub(b.LastCouponDate).Hours() / 24)
	if days < 0 {
		days = 0
	}

	// 日利率 = 年利率 / 360
	dailyRate := b.CouponRate.Value.Div(decimal.NewFromInt(360))

	// 應計利息 = 本金 × 日利率 × 天數
	accrued := b.Principal.Amount.
		Mul(dailyRate).
		Mul(decimal.NewFromInt(int64(days)))

	return types.Money{
		Amount:   accrued,
		Currency: b.Principal.Currency,
	}
}

// ConversionValue 計算轉換價值
func (b *ConvertibleBond) ConversionValue(stockPrice types.Money) types.Money {
	// 轉換價值 = 股價 × 轉換比例
	return types.Money{
		Amount:   stockPrice.Amount.Mul(b.ConversionRatio),
		Currency: stockPrice.Currency,
	}
}

// ShouldConvert 判斷是否應該轉換
func (b *ConvertibleBond) ShouldConvert(stockPrice, bondPrice types.Money) bool {
	convValue := b.ConversionValue(stockPrice)
	return convValue.GreaterThan(bondPrice)
}

// AnnualCouponPayment 年度票息支付
func (b *ConvertibleBond) AnnualCouponPayment() types.Money {
	return b.Principal.Mul(b.CouponRate.Value)
}