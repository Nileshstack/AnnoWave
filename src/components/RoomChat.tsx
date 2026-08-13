import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useRef, useState, useEffect} from 'react'
import { socket } from "@/lib/socket";
//ui improvements
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Users } from "lucide-react";
import { toast } from "sonner";

type RoomChatProps={roomCode: string}; 
const RoomChat = ({roomCode}:RoomChatProps) => {
  const{data: session, status }= useSession();
  const userId = (session?.user as any)?._id;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput]       = useState("");
  const [sending, setSending]   = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    fetchMessages();
  },[roomCode]);
   
  useEffect(()=>{
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  },[messages]);

    const fetchMessages= async()=>{
      setFetching(true);
      try {
        const res = await axios.get(`/api/room/send-message/${roomCode}/messages`);
        setMessages( res.data.messages)

      } catch (error) {
        console.log("Fetch Error",error);
        toast.error("Failed to fetch messages");
      }finally{
        setFetching(false);
      }
    }

   useEffect(() => {
  if (!roomCode) return;

  socket.emit("join-room", roomCode);

  const handleReceiveMessage = (message: any) => {
    setMessages((prev) => [...prev, message]);
  };

  socket.on("receive-message", handleReceiveMessage);

  return () => {
    socket.emit("leave-room", roomCode);
    socket.off("receive-message", handleReceiveMessage);
  };
}, [roomCode]);


    const handleSend= async()=>{
      if (!input.trim() || !userId) return;
      setSending(true);
      try {
        socket.emit("send-message", {
        roomCode,
        roomId: roomCode,
        senderId: userId,
        message: input.trim()
        });
        
        setInput("");
      } catch (error:any) {
        console.error(error?.response?.data?.message || "Send failed");
      }
      finally {
      setSending(false);
    }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOwnMessage = (senderId: string) => senderId === userId;
if (fetching) {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

return (
  <Card className="fixed inset-0 flex flex-col overflow-hidden rounded-none border-0 mt-10">

    {/* Header */}
    <div className="flex items-center justify-between border-b px-6 py-4 bg-white">
      <div className="flex items-center gap-3">

        <div>
          <h2 className="text-xl font-bold">
            Anonymous Room
          </h2>

          <p className="text-sm text-muted-foreground">
            Room Code: {roomCode}
          </p>
        </div>
      </div>

      <Badge variant="secondary" className="gap-1">
        <Users className="h-3 w-3" />
        Anonymous Chat
      </Badge>
    </div>

    <div className="flex-1 overflow-y-auto bg-muted/30 p-6">

      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <Card className="p-8 text-center shadow-none">
            <h3 className="font-semibold text-lg">
              No Messages Yet
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Start the anonymous conversation.
            </p>
          </Card>
        </div>
      ) : (
        <div className="space-y-5">
          {messages.map((msg) => {
            const own = isOwnMessage(msg.senderId);

            return (
              <div
                key={msg._id}
                className={`flex ${
                  own ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[75%] gap-3 ${
                    own ? "flex-row-reverse" : ""
                  }`}
                >

                  <div>
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        own
                          ? "bg-black text-white rounded-br-md"
                          : "bg-white border rounded-bl-md"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {msg.message}
                      </p>
                    </div>

                    <p
                      className={`mt-1 text-xs text-muted-foreground ${
                        own ? "text-right" : ""
                      }`}
                    >
                      {own ? "You" : "Anonymous"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div ref={bottomRef} />
    </div>

    <Separator />

    <div className="bg-white p-5">
      <div className="flex gap-3">

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write an anonymous message..."
          disabled={sending}
          rows={2}
          className="resize-none"
        />

        <Button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="h-auto px-6"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send
            </>
          )}
        </Button>

      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Press <span className="font-semibold">Enter</span> to send •
        <span className="font-semibold"> Shift + Enter</span> for a new line.
      </p>
    </div>

  </Card>
);
}

export default RoomChat
