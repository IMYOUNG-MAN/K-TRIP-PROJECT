"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Itinerary } from "@/lib/types";

const TIME_LABEL: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

function PremiumModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const utm = JSON.parse(localStorage.getItem("utm") ?? "{}");
    const quiz_profile = JSON.parse(localStorage.getItem("quiz_profile") ?? "null");

    await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source: utm.source ?? null,
        medium: utm.medium ?? null,
        campaign: utm.campaign ?? null,
        quiz_profile,
      }),
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
        {!submitted ? (
          <>
            <div className="space-y-1 text-center">
              <p className="text-2xl">✨</p>
              <h2 className="text-lg font-bold text-black">Premium is on its way</h2>
              <p className="text-sm text-gray-500">
                Booking links, local insider tips, and fan community connections —
                launching soon. Drop your email and you&apos;ll be the first to know.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Notify Me at Launch
              </button>
            </form>
            <button onClick={onClose} className="w-full text-xs text-gray-400 hover:text-gray-600">
              Maybe later
            </button>
          </>
        ) : (
          <div className="text-center space-y-3 py-2">
            <p className="text-3xl">🎉</p>
            <h2 className="font-bold text-black">You&apos;re on the list!</h2>
            <p className="text-sm text-gray-500">We&apos;ll reach out as soon as we launch.</p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("quiz_profile");
    if (!raw) {
      router.replace("/quiz");
      return;
    }

    const profile = JSON.parse(raw);

    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(true); return; }
        setItinerary(data);
      })
      .catch(() => setError(true));
  }, [router]);

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-gray-500">Something went wrong. Please give it another shot.</p>
        <button
          onClick={() => router.push("/quiz")}
          className="px-6 py-3 bg-black text-white rounded-2xl"
        >
          Try Again
        </button>
      </main>
    );
  }

  if (!itinerary) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="flex gap-2">
          {["✈️", "🗺️", "🎵"].map((emoji, i) => (
            <span
              key={i}
              className="text-3xl animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>
        <p className="text-lg font-medium text-gray-700">Crafting your Seoul itinerary...</p>
        <p className="text-sm text-gray-400">Usually takes about 30 seconds</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-6 py-12 space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <p className="text-xs tracking-widest text-gray-400 uppercase">Your K-Trip</p>
          <h1 className="text-2xl font-bold text-black">Your Seoul Itinerary</h1>
          <p className="text-sm text-gray-500">{itinerary.profile_summary}</p>
          <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2 leading-relaxed">
            ✨ AI-generated itinerary — locations are based on well-known K-culture spots, but we recommend confirming hours and availability before you visit.
          </p>
        </div>

        {/* Day cards */}
        {itinerary.days.map((day) => (
          <section key={day.day} className="border border-gray-100 rounded-2xl p-5 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">Day {day.day}</span>
              <h2 className="font-bold text-lg text-black">{day.theme}</h2>
            </div>

            <div className="space-y-4">
              {day.slots.map((slot, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-20 pt-0.5 text-xs text-gray-400 shrink-0">
                    {TIME_LABEL[slot.time] ?? slot.time}
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-black">{slot.location}</p>
                    <p className="text-xs text-gray-400">{slot.address}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{slot.fandom_connection}</p>
                    <p className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg inline-block">
                      💡 {slot.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Bonus spots */}
        {itinerary.bonus_spots.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-bold text-black">Don&apos;t Miss These</h3>
            <div className="space-y-2">
              {itinerary.bonus_spots.map((spot, i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-300 font-bold shrink-0">{i + 1}</span>
                  <div>
                    <p className="font-medium text-sm text-black">{spot.location}</p>
                    <p className="text-xs text-gray-500">{spot.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Premium fake door */}
        {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}
        <div className="rounded-2xl overflow-hidden border border-rose-100">
          <div className="bg-rose-50 px-5 pt-5 pb-4 space-y-1">
            <p className="text-xs font-semibold tracking-widest text-rose-400 uppercase">Premium</p>
            <p className="text-lg font-bold text-black leading-snug">
              Your itinerary, taken to the next level.
            </p>
            <p className="text-sm text-gray-500">
              Everything in your free plan — plus the tools that actually get you there.
            </p>
          </div>
          <div className="bg-white px-5 py-4 space-y-3">
            {[
              { icon: "🗺️", title: "Interactive Map View", desc: "See every spot on a visual map — plan your route, not just your day." },
              { icon: "🔗", title: "Direct Booking Links", desc: "One tap to reserve cafés, studios, and fan pop-ups before they sell out." },
              { icon: "🎤", title: "Fan Community Hookups", desc: "Get connected to local fan clubs and events happening during your trip." },
              { icon: "💡", title: "Insider Tips from Locals", desc: "Hidden entrances, best photo times, secret menu items — the stuff guides skip." },
              { icon: "📄", title: "Offline PDF Export", desc: "Download your full itinerary and use it without Wi-Fi." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-3 items-start">
                <span className="text-xl shrink-0">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-black">{title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white px-5 pb-5">
            <button
              onClick={() => setShowPremiumModal(true)}
              className="w-full py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors"
            >
              Unlock Premium — $9.99
            </button>
            <p className="text-xs text-center text-gray-400 mt-2">One-time payment · Instant access</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/quiz")}
          className="w-full py-3 border border-gray-200 rounded-2xl text-sm text-gray-500 hover:border-gray-400 transition-colors"
        >
          Start Over
        </button>
      </div>
    </main>
  );
}
