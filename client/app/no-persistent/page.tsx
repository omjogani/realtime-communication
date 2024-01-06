"use client";

import { ChatDisplay } from "@/components/Chat";
import { SocketProvider } from "@/contexts/SocketProvider";

const NoPersistent = () => {
  

  return (
    <div className="flex justify-center items-center">
      <SocketProvider>
        <ChatDisplay 
          communicationType="no-persistent"
        />
      </SocketProvider>
    </div>
  );
};

export default NoPersistent;
