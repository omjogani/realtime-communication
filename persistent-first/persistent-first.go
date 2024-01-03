package persistent_first

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/fatih/color"
	_ "github.com/lib/pq"
	"github.com/omjogani/realtime-communication/models"
	"golang.org/x/net/websocket"
)

type Server struct {
	conns map[*websocket.Conn]bool
}

func NewServer() *Server {
	return &Server{
		conns: make(map[*websocket.Conn]bool),
	}
}

func (s *Server) broadCastRequest(payload []byte) {
	// grab all WS Connection and write the payload
	for ws := range s.conns {
		go func(ws *websocket.Conn) {
			_, err := ws.Write(payload)
			if err != nil {
				color.Red("Error while Broadcasting Message: %v", err)
			}
		}(ws)
	}
}

func (s *Server) readLoop(ws *websocket.Conn) {
	buffer := make([]byte, 1024)
	for {
		value, err := ws.Read(buffer)
		if err != nil {
			if err == io.EOF {
				// Connection got disturbed from other end
				break
			}
			color.Red("Error while Reading Buffer: %v", err)
			continue
		}
		message := buffer[:value]
		messageStr := string(message)
		var data models.Message

		err = json.Unmarshal([]byte(messageStr), &data)
		if err != nil {
			color.Red("Error while Marshaling: ", err)
		}
		fmt.Print(data.Username, ": ")
		fmt.Println(data.Message)
		s.broadCastRequest(message)
	}
}

func (s *Server) RequestHandler(ws *websocket.Conn) {
	color.Blue("New Connection From Client: %v", ws.RemoteAddr())
	s.conns[ws] = true
	s.readLoop(ws)
}

func (s *Server) InsertRequestHandler(w http.ResponseWriter, r *http.Request) {
	var receivedData models.Message
	err := json.NewDecoder(r.Body).Decode(&receivedData)
	checkNilError(err, "Receiving Data")

	// Configure PostgreSQL
	const (
		host     = "localhost"
		port     = 5432
		user     = "omjogani"
		password = "OmJogani"
		dbname   = "msgDB"
	)

	// connStr := "db://omjogani:OmJogani@localhost:5432/msgDB?sslmode=disable"
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	checkNilError(err, "OpenDB")
	// defer db.Close()

	// Insert Data to PostgreSQL
	if receivedData.Message != "" {
		_, errQ := db.Exec(`
							DO $$
							BEGIN
								INSERT INTO Messages VALUES ('` + receivedData.Username + `', '` + receivedData.Message + `');
							EXCEPTION WHEN undefined_table THEN
								CREATE TABLE Messages (
									username TEXT,
									message TEXT
								);
								INSERT INTO Messages VALUES ('` + receivedData.Username + `', '` + receivedData.Message + `');
							END $$;
							`)
		checkNilError(errQ, "Database Insert Operation")
		fmt.Println(receivedData)
	}
}

func checkNilError(err error, context ...string) {
	if err != nil {
		log.Fatal(context, err)
	}
}
