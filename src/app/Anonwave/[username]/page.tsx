"use client"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiReasponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from "sonner";

const page = () => {
  const [loading,setLoading]=useState(false);
  const [generateLoading,setGenerateLoading]=useState(false);
   const [suggestions, setSuggestions] = useState<string[]>([]);

  const content=["What's a dream you've always wanted to pursue but haven't yet?","If you could instantly master any skill, what would it be and why?","What's a memorable experience that changed your perspective on life?"];
  useEffect(() => {
  setSuggestions(content);
}, []);
  //fetching username from the url
  const params = useParams<{ username: string }>();
  const username = params.username;
  const form = useForm<z.infer<typeof messageSchema >>({
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
  setLoading(true);
  try {
    const response = await axios.post<ApiReasponse>(
      "/api/send-message",
      {
        username,
        content: data.content,
      }
    );

    toast.success(response.data.message);// success
    form.reset({ content: "" });
   //AftDebug 403 forbidden is not error it is a response and gets catch block directly 
  } catch (error) {
    const err = error as AxiosError<ApiReasponse>;
    toast.error(err.response?.data.message || "Something went wrong");


  } finally {
    setLoading(false);
  }
};
 
  const generateSuggestions = async () => {
      setGenerateLoading(true);

      const res = await axios.post("/api/suggest-messages");
        const data = await res.data;
          const questions = data.text.split("||");
          if (questions.length > 0) {
            toast.success("Questions generated successfully");
          }

      setSuggestions(questions);
      setGenerateLoading(false);
    };
 return (
  <div className="max-w-3xl mx-auto mt-12 px-4">
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">
          Send an anonymous message
        </CardTitle>
        <CardDescription>
          Your message will be sent anonymously to{" "}
          <span className="font-semibold">@{username}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* messages forms */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write something kind, fun, or thoughtful..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </Form>

        <Separator />

        {/* open ai suggest's */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Need inspiration?
            </h3>

            <Button
              variant="outline"
              onClick={generateSuggestions}
              disabled={generateLoading}
            >
              {generateLoading ? "Generating..." : "Generate Questions"}
            </Button>
          </div>

          {/* loading skeletons */}
          {generateLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

          
          {!generateLoading && suggestions.length > 0 && (
            <div className="grid gap-3">
              {suggestions.map((q, i) => (
                <Card
                  key={i}
                  className="cursor-pointer transition hover:bg-muted"
                  onClick={() =>
                    // set the suggestion to the form input field name  content and use form.setValue
                    form.setValue("content", q)
                  }
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <Badge variant="secondary">AI</Badge>
                    <p className="text-sm text-muted-foreground">
                      {q}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

}
export default page
