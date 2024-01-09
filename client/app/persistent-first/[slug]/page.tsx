"use client";
import { ChatDisplay } from '@/components/Chat';
import { WebSocketProvider } from '@/contexts/WebSocketProvider'
import { usePathname } from 'next/navigation';
import React from 'react'

const PersistentFirst = () => {
  const path: string = usePathname();
  let username: string = path.split("/")[2];

  return (
    <div className="flex justify-center items-center">
      <WebSocketProvider communicationType="persistent-first">
        <ChatDisplay communicationType="persistent-first" username={username.replace(/%20/g, " ") ?? "Guest"} />
      </WebSocketProvider>
    </div>
  )
}

export default PersistentFirst