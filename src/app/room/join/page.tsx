"use client";
import React, { useEffect } from 'react'
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from 'axios';
//UI imprvements
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, DoorOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const page = () => {
const { data: session, status} = useSession();
const router = useRouter();
//const userId = (session?.user as any)?._id;

 useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("You must be signed in to join a room.");
      router.replace("/sign-in");
    }
  }, [status, router]);
 const [roomCode, setRoomCode] = useState("");  
const [loading, setLoading]   = useState(false);    
const [Status, setStatus]     = useState<{
  type: "success" | "error" | null;
  message: string;
}>({ type: null, message: "" });

const handelSubmit=async()=>{
  if(!roomCode.trim()){
    setStatus({type:"error",message:"Please enter a valid room code"})
    return;
  }
  /*if(!userId){
    setStatus({type:"error",message:"logged in first!"})
    return;
  }*/
  setLoading(true)
  setStatus({ type: null, message: "" });
  try {
    const response = await axios.post('/api/room/join',{
      roomCode:roomCode.trim(),
      //userId
    });
    setStatus({
      type: "success",
      message: response.data.message, 
    });
    setRoomCode("");
    toast.success(response.data.message);
    router.push(`/room/${roomCode.trim()}`);
  } catch (err:any) {
    setStatus({
      type: "error",
      message: err?.response?.data?.message || "Something went wrong. Try again.",
      
    });
    console.log(err);

  }finally{
    setLoading(false);
  }
};
   return (
  <div className="my-10 mx-4 md:mx-8 lg:mx-auto w-full max-w-3xl">
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          Join Room
        </CardTitle>

        <CardDescription className="text-base">
          Enter the room code shared by your friends and join the anonymous
          conversation instantly.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* Room Code */}
        <div className="space-y-3">
          <Label htmlFor="roomCode" className="font-semibold">
            Room Code
          </Label>

          <Input
            id="roomCode"
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter room code"
            disabled={loading}
            maxLength={20}
          />

          <p className="text-sm text-muted-foreground">
            Ask your friend to share the room code with you.
          </p>
        </div>

        {/* Button */}
        <Button
          className="w-full"
          disabled={loading || !roomCode.trim()}
          onClick={handelSubmit}
        >
          <DoorOpen className="mr-2 h-4 w-4" />

          {loading ? "Joining..." : "Join Room"}

          {!loading && (
            <ArrowRight className="ml-2 h-4 w-4" />
          )}
        </Button>

        
        {Status.type && (
          <>
            <Separator />

            <div
              className={`flex items-start gap-3 rounded-lg border p-4 ${
                Status.type === "success"
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              {Status.type === "success" ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
              )}

              <div>
                <p
                  className={`font-semibold ${
                    Status.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {Status.type === "success"
                    ? "Success"
                    : "Unable to Join"}
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                  {Status.message}
                </p>
              </div>
            </div>
          </>
        )}

        <Separator />

        
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Join rooms instantly using a valid room code.</p>
          <p>• Your identity remains anonymous inside the room.</p>
          <p>• Room Messages automatically expire after 24 hours.</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

  
}

export default page
