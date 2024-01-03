package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/fatih/color"
	"github.com/joho/godotenv"
	no_persistent "github.com/omjogani/realtime-communication/no-persistent"
	persistent_first "github.com/omjogani/realtime-communication/persistent-first"
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
	if PORT == "" {
		PORT = "3550"
	}
	PORT = "3551"

	// Redirection Paths
	http.Handle("/no-persistent", websocket.Handler(no_persistent.NewServer().RequestHandler))
	http.Handle("/persistent-first", websocket.Handler(persistent_first.NewServer().RequestHandler))
	// http.Handle("/persistent-later", websocket.Handler())

	color.Green("Server is listening at: %v", PORT)
	color.Blue("------------------------------")
	http.ListenAndServe(fmt.Sprintf(":%v", PORT), nil)
}
