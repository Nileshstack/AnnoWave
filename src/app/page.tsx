"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import Link from "next/link";

const Page = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          Welcome to the{" "}
          <span className="text-indigo-600">AnonWave World</span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-gray-600">
          Send and receive anonymous messages with ease. Join our community
          today and start sharing your thoughts without revealing your identity.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/sign-up"><Button size="lg">Get Started</Button></Link>
          
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          What People Are Saying
        </h2>

        <Carousel
          plugins={[Autoplay({ delay: 2500 })]}
          className="w-full max-w-3xl mx-auto"
        >
          <CarouselContent>
            {messages.map((msg, index) => (
              <CarouselItem key={index}>
                <div className="p-3">
                  <Card className="shadow-md border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-800">
                        {msg.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {msg.content}
                      </p>
                      <p className="mt-4 text-sm text-gray-400">
                        {msg.received}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
      
    </main>
  );
};

export default Page;
