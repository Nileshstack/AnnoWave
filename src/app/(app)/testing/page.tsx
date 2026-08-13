"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function Home() {
  useEffect(() => {
    if (socket.connected) {
      console.log("✅ Already Connected:", socket.id);
    }

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return <h1>Socket Test</h1>;
}