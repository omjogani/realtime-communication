"use client";

import React, { useCallback, useContext, useState, useEffect } from "react";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
  messages: string[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`State is Undefined`);
  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket>();
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log(`Message :${msg}`);
      if (socket) {
        socket.send(JSON.stringify({ Username: "Om", Message: msg }));
      }
    },
    [socket]
  );

  const onMessageReceive = useCallback((msg: string) => {
    console.log(`From Server MSG Rec ${msg}`);

    const { Message } = JSON.parse(msg) as { Message: string };
    setMessages((prev) => [...prev, Message]);
  }, []);

  useEffect(() => {
    const _webSocket = new WebSocket("ws://localhost:3551/no-persistent");
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
