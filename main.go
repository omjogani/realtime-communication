package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"golang.org/x/net/websocket"
)

func main() {
	// Load PORT from Environment Variables
	envError := godotenv.Load(".env")
	if envError != nil {
		fmt.Println("ERROR: ", envError)
		log.Fatal("Could not load Environment Variables...")
	}
	PORT := os.Getenv("PORT_NO")

	// Redirection Paths
	http.Handle("/no-persistent", websocket.Handler())
	http.Handle("/persistent-first", websocket.Handler())
	http.Handle("/persistent-later", websocket.Handler())

	http.ListenAndServe(PORT, nil)
}
