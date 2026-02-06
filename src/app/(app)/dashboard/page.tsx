"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiReasponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/sign-in");
  }, [status, router]);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((m) => m._id.toString() !== messageId));
  };

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: { acceptMessages: false },
  });

  const { watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptedMessages = useCallback(async () => {
    try {
      setIsSwitchLoading(true);
      const res = await axios.get("/api/accept-message");
      setValue("acceptMessages", res.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiReasponse>;
      toast.error(axiosError.response?.data.message || "Something went wrong");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh = false) => {
    try {
      setIsLoading(true);
      const res = await axios.get<ApiReasponse>("/api/get-messages");
      setMessages((res.data.messages as Message[]) || []);
      if (refresh) toast.success("Messages refreshed");
    } catch (error) {
      const axiosError = error as AxiosError<ApiReasponse>;
      toast.error(axiosError.response?.data.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchMessages();
    fetchAcceptedMessages();
  }, [status, fetchMessages, fetchAcceptedMessages]);

  const handleSwitchChange = async (value: boolean) => {
    await axios.post("/api/accept-message", { isAcceptingMessages: value });
    setValue("acceptMessages", value);
  };

  const { username } = session?.user || {};
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const profileUrl = `${baseUrl}/Anonwave/${username}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied");
  };

  const shareOnWhatsApp = () => {
    const text = `Send me anonymous messages\n${profileUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareOnInstagram = async () => {
    await navigator.clipboard.writeText(
      `Send me anonymous messages\n${profileUrl}`
    );
    window.open("https://www.instagram.com/", "_blank");
  };

  return (
    <div className="my-10 mx-4 md:mx-8 lg:mx-auto w-full max-w-6xl rounded-xl border bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your anonymous messages and sharing preferences
        </p>
      </div>

      {/* Profile URL */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">Profile URL</h2>
        <div className="flex gap-2">
          <input
            value={profileUrl}
            disabled
            className="w-full rounded-md border bg-muted px-3 py-2 text-sm"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
         <p className="text-m mt-2 ">
          Share this URL to receive anonymous messages from your friends and followers.
        </p>
      </div>
      
      <div className="mb-6 flex items-center gap-3">
        <Switch
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="text-sm font-medium">
          Accept Messages:{" "}
          <span
            className={
              acceptMessages ? "text-green-600" : "text-muted-foreground"
            }
          >
            {acceptMessages ? "On" : "Off"}
          </span>
        </span>
      </div>

      <Separator />

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>

        <Button variant="secondary" onClick={shareOnWhatsApp}>
          Share WhatsApp
        </Button>

        <Button variant="secondary" onClick={shareOnInstagram}>
          Share Instagram
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No messages received yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default page;
