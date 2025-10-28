package main

import (
	"fvm-lite-demo/api"
	"log"
	"net/http"
)

func main() {
	server := api.NewServer()
	handler := server.SetupRoutes()

	log.Println("🚀 FVM Engine starting...")
	log.Println("📡 API Server: http://localhost:3001")
	log.Println("📚 API Docs:")
	log.Println("   POST   /api/bonds - Create bond")
	log.Println("   GET    /api/bonds/:id - Get bond")
	log.Println("   POST   /api/bonds/:id/coupon - Pay coupon")
	log.Println("   POST   /api/bonds/:id/convert - Convert bond")
	log.Println("   GET    /api/bonds/:id/value - Calculate value")
	log.Println("   GET    /api/events - Get all events")
	log.Println("   GET    /api/mock-stock-price - Get mock stock price")
	log.Println("")
	log.Println("✅ Server ready!")

	if err := http.ListenAndServe(":3001", handler); err != nil {
		log.Fatal(err)
	}
}