"use client";

import { ChatDisplay } from "@/components/Chat";
import { usePathname } from 'next/navigation';
import { SocketProvider } from "@/contexts/SocketProvider";

const NoPersistent = () => {
  const path: string = usePathname();
  let username: string = path.split("/")[2];

  return (
    <div className="flex justify-center items-center">
      <SocketProvider>
        <ChatDisplay communicationType="no-persistent" username={username.replace(/%20/g, " ") ?? "Guest"} />
      </SocketProvider>
    </div>
  );
};

export default NoPersistent;
