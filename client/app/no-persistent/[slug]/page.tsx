"use client";

import { ChatDisplay } from "@/components/Chat";
import { usePathname } from 'next/navigation';
import { WebSocketProvider } from "@/contexts/WebSocketProvider";

const NoPersistent = () => {
  const path: string = usePathname();
  let username: string = path.split("/")[2];

  return (
    <div className="flex justify-center items-center">
      <WebSocketProvider communicationType="no-persistent">
        <ChatDisplay communicationType="no-persistent" username={username.replace(/%20/g, " ") ?? "Guest"} />
      </WebSocketProvider>
    </div>
  );
};

export default NoPersistent;
