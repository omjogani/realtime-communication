package main

import (
	"flag"
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
	CMDPORT := flag.String("port", "", "Port Number to start Server")
	flag.Parse()

	if *CMDPORT == "" {
		PORT := os.Getenv("PORT_NO")
		if PORT == "" {
			PORT = "3550"
		}
		PORT = "3551" // TODO: REMOVE THIS LINE
		*CMDPORT = PORT
	}

	noPersistentConnection := no_persistent.NewServer()
	persistentFirstConnection := persistent_first.NewServer()
	// Redirection Paths
	http.Handle("/no-persistent", websocket.Handler(noPersistentConnection.RequestHandler))
	http.Handle("/persistent-first", websocket.Handler(persistentFirstConnection.RequestHandler))
	http.HandleFunc("/persistent-first-insert", persistentFirstConnection.InsertRequestHandler)
	// http.Handle("/persistent-later", websocket.Handler())

	color.Green("Server is listening at: %v", *CMDPORT)
	color.Blue("------------------------------")
	http.ListenAndServe(fmt.Sprintf(":%v", *CMDPORT), nil)
}
