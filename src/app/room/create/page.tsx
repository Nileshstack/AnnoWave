"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
//Ui improvements
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2, AlertCircle, Plus, Users } from "lucide-react";
import { toast } from "sonner";
export default function CreateRoom() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?._id;
  const username = session?.user?.username;

  useEffect(()=>{
  if(status=="unauthenticated"){
    toast.error("You must be signed in to create a room.");
    router.replace("/sign-in");
  }
  })

  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [Status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
    roomCode?: string;
  }>({ type: null, message: "" });

  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
  if (!Status.roomCode || countdown === null) return;

  if (countdown === 0) {
    router.push(`/room/${Status.roomCode}`);
    toast.success("Enjoy your anonymous chat.");
    return;
  }

  const timer = setTimeout(() => {
    setCountdown((prev) => (prev !== null ? prev - 1 : null));
  }, 1000);

  return () => clearTimeout(timer);
}, [countdown, Status.roomCode, router]);


  const handleSubmit = async () => {
    if (!roomName.trim()) {
      setStatus({ type: "error", message: "Room name is required." });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await axios.post("/api/room/create", {
        roomName,
        members: [username],
        createdBy: userId,
      });

      const createdRoomCode = response.data.room?.roomCode;

      setStatus({
        type: "success",
        message: response.data.message || "Room created!",
        roomCode: createdRoomCode,
      });

      setCountdown(10);
      setRoomName("");
    } catch (err: any) {
      setStatus({
        type: "error",
        message:
          err?.response?.data?.message || "Something went wrong. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="my-11 mx-3 md:mx-8 lg:mx-auto w-full max-w-6xl rounded-xl border bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-sm">
    <Card className="shadow-sm ">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          Create Room
        </CardTitle>

        <CardDescription className="text-base">
          Create a private anonymous room and share the room code with your
          friends.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        <div className="space-y-3">
          <Label htmlFor="roomName" className="font-semibold">
            Room Name
          </Label>

          <Input
            id="roomName"
            placeholder="Enter your room name..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            disabled={loading}
            maxLength={60}
          />

          <p className="text-sm text-muted-foreground">
            Choose a memorable room name. Rooms expire automatically after 24
            hours.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="flex-1"
            disabled={loading || !roomName.trim()}
            onClick={handleSubmit}
          >
            <Plus className="mr-2 h-4 w-4" />

            {loading ? "Creating..." : "Create Room"}
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/room/join")}
          >
            <Users className="mr-2 h-4 w-4" />
            Join Existing Room
          </Button>
        </div>

  {Status.type && (
  <Alert
    variant={Status.type === "error" ? "destructive" : "default"}
    className="mt-4"
  >
    {Status.type === "success" ? (
      <CheckCircle2 className="h-5 w-5 text-green-600" />
    ) : (
      <AlertCircle className="h-5 w-5" />
    )}

    <AlertTitle className="text-base font-semibold">
      {Status.type === "success"
        ? "Room Created Successfully!"
        : "Unable to Create Room"}
    </AlertTitle>

    <AlertDescription className="mt-4 space-y-5">

      {Status.roomCode && (
        <>
          <Separator />

          {/* Room Code + Countdown */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* Room Code */}
            <div className="flex-1 w-full">
              <Label className="font-semibold">Room Code</Label>

              <div className="mt-2 flex gap-2">
                <Input
                  value={Status.roomCode}
                  readOnly
                  className="font-mono text-lg font-semibold tracking-[0.3em]"
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(Status.roomCode!);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <Badge variant="secondary" className="mt-3">
                Share this code with your friends
              </Badge>

              <Button
                className="mt-6 w-full"
                onClick={() => router.push(`/room/${Status.roomCode}`)}
              >
                Enter Room Now
              </Button>
            </div>

            {/* Countdown */}
            {countdown !== null && (
              <Card className="w-full lg:w-72 shadow-none">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">
                    Redirecting to your room in
                  </p>

                  <h2 className="mt-3 text-5xl font-bold">
                    {countdown}s
                  </h2>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </AlertDescription>
  </Alert>
)}

        <Separator />

        {/* Footer */}
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>• Rooms automatically expire after 24 hours.</p>

          <p>• Messages remain anonymous.</p>

          <p>• Invite friends using your unique room code.</p>
        </div>
      </CardContent>
    </Card>
  </div>
);
  
}