"use client";

import React, { useCallback, useContext, useState, useEffect } from "react";

interface SocketProviderProps {
  communicationType: string;
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (username: string, msg: string) => any;
  messages: [string, string][];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`State is Undefined`);
  return state;
};

export const WebSocketProvider: React.FC<SocketProviderProps> = ({ communicationType, children }) => {
  const [socket, setSocket] = useState<WebSocket>();
  const [messages, setMessages] = useState<[string, string][]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (username, msg) => {
      console.log(`Message :${msg}`);
      if (socket) {
        socket.send(JSON.stringify({ Username: username, Message: msg }));
      }
    },
    [socket]
  );

  const onMessageReceive = useCallback((msg: string) => {
    console.log(`From Server MSG Rec ${msg}`);

    const { Username, Message } = JSON.parse(msg) as { Username: string, Message: string };
    setMessages((prev) => [...prev, [Username, Message]]);
  }, []);

  useEffect(() => {
    const _webSocket = new WebSocket(`ws://localhost:3551/${communicationType}`);
    console.log(_webSocket);
    _webSocket.onmessage = (event: any) => onMessageReceive(event.data);
    setSocket(_webSocket);
    return () => {
      _webSocket.close();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
