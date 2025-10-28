package api

import (
	"encoding/json"
	"fvm-lite-demo/internal/bond"
	"fvm-lite-demo/internal/calculator"
	"fvm-lite-demo/internal/engine"
	"fvm-lite-demo/internal/types"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

type Server struct {
	engine *engine.FVMEngine
}

func NewServer() *Server {
	return &Server{
		engine: engine.NewEngine(),
	}
}

// CreateBondRequest 創建債券請求
type CreateBondRequest struct {
	Principal       float64 `json:"principal"`
	Currency        string  `json:"currency"`
	CouponRate      float64 `json:"coupon_rate"`
	MaturityYears   int     `json:"maturity_years"`
	ConversionPrice float64 `json:"conversion_price"`
	ConversionRatio float64 `json:"conversion_ratio"`
}

// SetupRoutes 設置路由
func (s *Server) SetupRoutes() http.Handler {
	mux := http.NewServeMux()

	// 路由
	mux.HandleFunc("/api/bonds", s.handleBonds)
	mux.HandleFunc("/api/bonds/", s.handleBondOperations)
	mux.HandleFunc("/api/events", s.handleEvents)
	mux.HandleFunc("/api/mock-stock-price", s.handleMockStockPrice)

	// CORS中間件
	return corsMiddleware(mux)
}

// 處理債券列表
func (s *Server) handleBonds(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		bonds := s.engine.GetAllBonds()
		respondJSON(w, http.StatusOK, bonds)
	case http.MethodPost:
		s.handleCreateBond(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// 創建債券
func (s *Server) handleCreateBond(w http.ResponseWriter, r *http.Request) {
	var req CreateBondRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	now := time.Now()
	b := &bond.ConvertibleBond{
		ID:              uuid.New().String(),
		Principal:       types.NewMoney(req.Principal, req.Currency),
		CouponRate:      types.NewRate(req.CouponRate),
		IssueDate:       now,
		MaturityDate:    now.AddDate(req.MaturityYears, 0, 0),
		ConversionPrice: types.NewMoney(req.ConversionPrice, req.Currency),
		ConversionRatio: decimal.NewFromFloat(req.ConversionRatio),
		State:           types.StateActive,
		LastCouponDate:  now,
	}

	if err := s.engine.IssueBond(b); err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, map[string]string{"id": b.ID})
}

// 處理債券操作
func (s *Server) handleBondOperations(w http.ResponseWriter, r *http.Request) {
	// 提取bond ID
	path := strings.TrimPrefix(r.URL.Path, "/api/bonds/")
	parts := strings.Split(path, "/")
	bondID := parts[0]

	if len(parts) == 1 && r.Method == http.MethodGet {
		s.handleGetBond(w, bondID)
		return
	}

	if len(parts) == 2 {
		operation := parts[1]
		switch operation {
		case "coupon":
			s.handlePayCoupon(w, r, bondID)
		case "convert":
			s.handleConvertBond(w, r, bondID)
		case "value":
			s.handleCalculateValue(w, r, bondID)
		default:
			http.Error(w, "Unknown operation", http.StatusNotFound)
		}
		return
	}

	http.Error(w, "Invalid path", http.StatusNotFound)
}

// 獲取債券詳情
func (s *Server) handleGetBond(w http.ResponseWriter, bondID string) {
	b, err := s.engine.GetBond(bondID)
	if err != nil {
		respondError(w, http.StatusNotFound, err.Error())
		return
	}

	// 計算額外信息
	now := time.Now()
	accruedInterest := b.AccruedInterest(now)
	marketRate := types.NewRate(0.04) // 假設市場利率4%
	presentValue := calculator.CalculatePresentValue(b, marketRate, now)

	response := map[string]interface{}{
		"bond":             b,
		"accrued_interest": accruedInterest,
		"present_value":    presentValue,
	}

	respondJSON(w, http.StatusOK, response)
}

// 支付票息
func (s *Server) handlePayCoupon(w http.ResponseWriter, r *http.Request, bondID string) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	amount, err := s.engine.PayCoupon(bondID)
	if err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"amount": amount,
	})
}

// 轉換債券
func (s *Server) handleConvertBond(w http.ResponseWriter, r *http.Request, bondID string) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		StockPrice float64 `json:"stock_price"`
		Currency   string  `json:"currency"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	stockPrice := types.NewMoney(req.StockPrice, req.Currency)
	if err := s.engine.ConvertBond(bondID, stockPrice); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{"status": "converted"})
}

// 計算價值
func (s *Server) handleCalculateValue(w http.ResponseWriter, r *http.Request, bondID string) {
	b, err := s.engine.GetBond(bondID)
	if err != nil {
		respondError(w, http.StatusNotFound, err.Error())
		return
	}

	now := time.Now()
	marketRate := types.NewRate(0.04)

	accruedInterest := b.AccruedInterest(now)
	presentValue := calculator.CalculatePresentValue(b, marketRate, now)

	// 模擬股價
	stockPrice := types.NewMoney(150+rand.Float64()*20-10, "USD")
	conversionValue := b.ConversionValue(stockPrice)

	response := map[string]interface{}{
		"accrued_interest": accruedInterest,
		"present_value":    presentValue,
		"conversion_value": conversionValue,
		"stock_price":      stockPrice,
	}

	respondJSON(w, http.StatusOK, response)
}

// 獲取事件
func (s *Server) handleEvents(w http.ResponseWriter, r *http.Request) {
	events := s.engine.GetEvents()
	respondJSON(w, http.StatusOK, events)
}

// 模擬跨鏈獲取股價
func (s *Server) handleMockStockPrice(w http.ResponseWriter, r *http.Request) {
	basePrice := 150.0
	fluctuation := rand.Float64()*20 - 10

	response := map[string]interface{}{
		"price": types.NewMoney(basePrice+fluctuation, "USD"),
		"source": "Simulated Ethereum Oracle (Uniswap V3)",
		"chain":  "Ethereum Mainnet",
		"timestamp": time.Now(),
	}

	respondJSON(w, http.StatusOK, response)
}

// CORS中間件
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// 工具函數
func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("Error encoding JSON: %v", err)
	}
}

func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, map[string]string{"error": message})
}