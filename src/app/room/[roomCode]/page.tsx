"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import RoomChat from "@/components/RoomChat";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
export default function RoomPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const roomCode = params.roomCode as string;


  const [access, setAccess] = useState<"checking" | "granted" | "denied">("checking");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      toast.error("You must be signed in to access this room.");
      router.replace("/sign-in");
      return;
    }
    checkAccess();
  }, [status, roomCode]);
/*  console.log(params);
console.log(roomCode);*/

  const checkAccess = async () => {
    try {
  const res = await axios.get(
    `/api/room/send-message/${roomCode}/is-member`
  );
  setAccess("granted");
} catch (err: any) {

  setAccess("denied");
}
  };

  if (status === "loading" || access === "checking") {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20">
      <Card className="w-full max-w-sm p-8 text-center shadow-md">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />

        <h2 className="mt-4 text-lg font-semibold">
          Verifying Access
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Please wait while we verify your access...
        </p>
      </Card>
    </div>
  );
}

  if (access === "denied") {
    router.replace("/");
    return null;
  }

  // Access confirmed
  return <RoomChat roomCode={roomCode} />;
}