"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const ChooseCommunicationType = () => {
  return (
    <div className="text-center pt-5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Choose Communication Type</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <Link href="/no-persistent">No Persistent (Zoom/GMeet Chat)</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
          <Link href="/persistent-first">Persistent First (Slack)</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
          <Link href="/persistent-later">Persistent Later (WhatsApp)</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChooseCommunicationType;
