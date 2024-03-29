"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useState } from "react";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { useSocket } from "@/contexts/WebSocketProvider";

interface ChatProps {
  communicationType: string;
  username: string;
}

export function ChatDisplay({ communicationType, username }: ChatProps) {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  async function sendMessageRequest(endpoint: string) {
    await fetch(`http://localhost:3551/${endpoint}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: username,
        Message: message,
      }),
    })
      .then(() => console.log("Data inserted"))
      .catch((err) => console.log(err));
  }

  return (
    <div className="flex h-screen bg-slate-800 w-1/2 flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2 text-3xl">
          <h1>Start Chatting</h1>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
      </div>
      <Separator />
      {messages ? (
        <div className="flex flex-1 flex-col">
          {messages.map((e, index) => (
            <div
              key={index}
              className="flex items-start p-4 m-2 rounded-md bg-slate-600"
            >
              <div className="flex items-start gap-4 text-sm">
                <Avatar className="bg-slate-400">
                  <AvatarImage alt={e[0]} />
                  <AvatarFallback>
                    {e[0]
                      .split(" ")
                      .map((chunk) => chunk[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-semibold">{e[0]}</div>
                  <div className="line-clamp-1 text-xs">{e[1]}</div>
                  <div className="line-clamp-1 text-xs">
                    {new Date().toString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Separator />
          <Separator className="mt-auto" />
          <div className="p-4">
            <form>
              <div className="grid gap-4">
                <Textarea
                  className="p-4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Type message here...`}
                />
                <div className="flex items-center">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setMessage("");
                      if(communicationType == "no-persistent"){
                        sendMessage(username, message);
                      } else {
                        sendMessageRequest(`${communicationType}-insert`);
                      }
                    }}
                    size="sm"
                    className="ml-auto"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
}
