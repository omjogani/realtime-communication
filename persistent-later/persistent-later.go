package persistent_later

import (
	"encoding/json"
	"fmt"
	"io"

	"github.com/fatih/color"
	"github.com/go-redis/redis"
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

func (s *Server) readLoop(ws *websocket.Conn, redisClient *redis.Client) {
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
		// s.broadCastRequest(message)
		errRedis := redisClient.Publish("MESSAGES", messageStr).Err()
		if errRedis != nil {
			panic(err)
		}
	}
}

func (s *Server) RequestHandler(ws *websocket.Conn) {
	color.Blue("New Connection From Client: %v", ws.RemoteAddr())
	var redisClient = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
	s.conns[ws] = true
	s.readLoop(ws, redisClient)
}
