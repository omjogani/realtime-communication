package no_persistent

import (
	"io"

	"github.com/fatih/color"
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
				color.Red("Error while Broadcasting Message: ", err)
			}
		}(ws)
	}
}

func (s *Server) readLoop(ws *websocket.Conn) {
	buffer := make([]byte, 1024)
	for {
		value, err := ws.Read(buffer)
		if err != nil {
			if err != io.EOF {
				color.Red("Connection got disturbed from other end: ", err)
				break
			}
			color.Red("Error while Reading Buffer: ", err)
			continue
		}
		message := buffer[:value]
		s.broadCastRequest(message)
	}
}

func (s *Server) RequestHandler(ws *websocket.Conn) {
	color.BlueString("New Connection From Client", ws.RemoteAddr())
	s.conns[ws] = true
	s.readLoop(ws)
}
