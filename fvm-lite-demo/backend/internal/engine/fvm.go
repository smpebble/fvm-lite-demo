package engine

import (
	"errors"
	"fvm-lite-demo/internal/bond"
	"fvm-lite-demo/internal/types"
	"sync"
	"time"
)

// FVMEngine FVM引擎
type FVMEngine struct {
	bonds  map[string]*bond.ConvertibleBond
	events []BondEvent
	mu     sync.RWMutex
}

// BondEvent 債券事件
type BondEvent struct {
	Type      string      `json:"type"`
	BondID    string      `json:"bond_id"`
	Timestamp time.Time   `json:"timestamp"`
	Data      interface{} `json:"data,omitempty"`
}

// NewEngine 創建FVM引擎
func NewEngine() *FVMEngine {
	return &FVMEngine{
		bonds:  make(map[string]*bond.ConvertibleBond),
		events: make([]BondEvent, 0),
	}
}

// IssueBond 發行債券
func (e *FVMEngine) IssueBond(b *bond.ConvertibleBond) error {
	e.mu.Lock()
	defer e.mu.Unlock()

	if _, exists := e.bonds[b.ID]; exists {
		return errors.New("bond already exists")
	}

	e.bonds[b.ID] = b
	e.events = append(e.events, BondEvent{
		Type:      "issued",
		BondID:    b.ID,
		Timestamp: time.Now(),
		Data: map[string]interface{}{
			"principal":   b.Principal,
			"coupon_rate": b.CouponRate,
		},
	})

	return nil
}

// GetBond 獲取債券
func (e *FVMEngine) GetBond(bondID string) (*bond.ConvertibleBond, error) {
	e.mu.RLock()
	defer e.mu.RUnlock()

	b, exists := e.bonds[bondID]
	if !exists {
		return nil, errors.New("bond not found")
	}

	return b, nil
}

// PayCoupon 支付票息
func (e *FVMEngine) PayCoupon(bondID string) (types.Money, error) {
	e.mu.Lock()
	defer e.mu.Unlock()

	b, exists := e.bonds[bondID]
	if !exists {
		return types.Money{}, errors.New("bond not found")
	}

	couponAmount := b.AnnualCouponPayment()
	b.LastCouponDate = time.Now()

	e.events = append(e.events, BondEvent{
		Type:      "coupon_paid",
		BondID:    bondID,
		Timestamp: time.Now(),
		Data:      couponAmount,
	})

	return couponAmount, nil
}

// ConvertBond 轉換債券
func (e *FVMEngine) ConvertBond(bondID string, stockPrice types.Money) error {
	e.mu.Lock()
	defer e.mu.Unlock()

	b, exists := e.bonds[bondID]
	if !exists {
		return errors.New("bond not found")
	}

	if b.State != types.StateActive {
		return errors.New("bond is not active")
	}

	b.State = types.StateConverted

	e.events = append(e.events, BondEvent{
		Type:      "converted",
		BondID:    bondID,
		Timestamp: time.Now(),
		Data: map[string]interface{}{
			"stock_price":      stockPrice,
			"conversion_value": b.ConversionValue(stockPrice),
		},
	})

	return nil
}

// GetEvents 獲取所有事件
func (e *FVMEngine) GetEvents() []BondEvent {
	e.mu.RLock()
	defer e.mu.RUnlock()

	return e.events
}

// GetAllBonds 獲取所有債券
func (e *FVMEngine) GetAllBonds() []*bond.ConvertibleBond {
	e.mu.RLock()
	defer e.mu.RUnlock()

	bonds := make([]*bond.ConvertibleBond, 0, len(e.bonds))
	for _, b := range e.bonds {
		bonds = append(bonds, b)
	}
	return bonds
}