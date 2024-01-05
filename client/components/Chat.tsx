import { Mail } from "./data";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

interface MailDisplayProps {
  mail: Mail | null;
}

export function ChatDisplay({ mail }: MailDisplayProps) {
  return (
    <div className="flex h-screen bg-slate-800 w-1/2 flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2 text-3xl">
          <h1>Start Chatting</h1>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
      </div>
      <Separator />
      {mail ? (
        <div className="flex flex-1 flex-col ">
          <div className="flex items-start p-4 m-2 rounded-md bg-slate-600">
            <div className="flex items-start gap-4 text-sm">
              <Avatar className="bg-slate-400">
                <AvatarImage alt={mail.name} />
                <AvatarFallback>
                  {mail.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.name}</div>
                <div className="line-clamp-1 text-xs">{mail.subject}</div>
                <div className="line-clamp-1 text-xs">{mail.email}</div>
              </div>
            </div>
          </div>
          <Separator />
          <Separator className="mt-auto" />
          <div className="p-4">
            <form>
              <div className="grid gap-4">
                <Textarea
                  className="p-4"
                  placeholder={`Reply ${mail.name}...`}
                />
                <div className="flex items-center">
                  <Button size="sm" className="ml-auto">
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
