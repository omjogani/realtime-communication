package no_persistent

import "golang.org/x/net/websocket"

type Server struct {
	conn map[*websocket.Conn]bool
}

func NewServer() *Server {
	return &Server{
		conn: make(map[*websocket.Conn]bool),
	}
}

func (s *Server) broadCastRequest(ws *websocket.Conn) {

}

func (s *Server) readLoop(ws *websocket.Conn) {

}

func (s *Server) RequestHandler(ws *websocket.Conn) {

}
