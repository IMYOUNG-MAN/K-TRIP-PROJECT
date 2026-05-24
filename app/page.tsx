"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function UTMCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const source = searchParams.get("utm_source");
    const medium = searchParams.get("utm_medium");
    const campaign = searchParams.get("utm_campaign");

    if (source || medium || campaign) {
      localStorage.setItem("utm", JSON.stringify({ source, medium, campaign }));
    }
  }, [searchParams]);

  return null;
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <Suspense>
        <UTMCapture />
      </Suspense>
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-2">
          <p className="text-sm tracking-widest text-gray-400 uppercase">K-Trip</p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-black">
            Tell us your K-drama.
            <br />
            We&apos;ll plan your Korea.
          </h1>
        </div>

        <p className="text-gray-500 text-lg leading-relaxed">
          Share your favorite K-dramas and K-pop groups.
          <br />
          We&apos;ll build a Seoul itinerary made just for you.
        </p>

        <Link
          href="/quiz"
          className="inline-block w-full py-4 bg-black text-white font-semibold rounded-2xl text-lg hover:bg-gray-800 transition-colors"
        >
          Build My Itinerary →
        </Link>

        <p className="text-xs text-gray-300">Free · Takes 1 minute · No sign-up needed</p>
      </div>
    </main>
  );
}
