"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuizProfile } from "@/lib/types";

const DRAMAS = [
  "Extraordinary Attorney Woo",
  "The Glory",
  "Squid Game",
  "Queen of Tears",
  "Crash Landing on You",
  "Goblin",
  "Hospital Playlist",
  "Itaewon Class",
  "Hometown Cha-Cha-Cha",
  "Twenty-Five Twenty-One",
];

const KPOP = [
  "BTS", "NewJeans", "aespa", "SEVENTEEN", "LE SSERAFIM",
  "Stray Kids", "BLACKPINK", "IVE", "NCT", "TWICE",
];

const STYLES = ["Photo Spots", "Food & Dining", "Shopping", "Wellness"];

const TOTAL_STEPS = 5;

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<QuizProfile>({
    dramas: [],
    kpop: [],
    duration: "3",
    style: [],
    companion: "solo",
  });

  const toggle = (key: "dramas" | "kpop" | "style", value: string) => {
    setProfile((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const handleSubmit = () => {
    localStorage.setItem("quiz_profile", JSON.stringify(profile));
    router.push("/result");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      <div className="max-w-lg w-full space-y-8">

        {/* Progress bar */}
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < step ? "bg-black" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Dramas */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What K-dramas are you into?</h2>
            <p className="text-gray-400 text-sm">Pick as many as you like</p>
            <div className="flex flex-wrap gap-2">
              {DRAMAS.map((d) => (
                <button
                  key={d}
                  onClick={() => toggle("dramas", d)}
                  className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                    profile.dramas.includes(d)
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: K-pop */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Which K-pop groups do you love?</h2>
            <p className="text-gray-400 text-sm">Pick as many as you like</p>
            <div className="flex flex-wrap gap-2">
              {KPOP.map((g) => (
                <button
                  key={g}
                  onClick={() => toggle("kpop", g)}
                  className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                    profile.kpop.includes(g)
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Duration */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">How long is your trip?</h2>
            <div className="flex gap-3">
              {(["3", "5", "7"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setProfile((p) => ({ ...p, duration: d }))}
                  className={`flex-1 py-4 rounded-2xl border text-center font-medium transition-colors ${
                    profile.duration === d
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="text-xl font-bold">{d} nights</div>
                  <div className="text-sm">{Number(d) + 1} days</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Travel style */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What&apos;s your travel style?</h2>
            <p className="text-gray-400 text-sm">Pick as many as you like</p>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle("style", s)}
                  className={`px-5 py-3 rounded-2xl border text-sm font-medium transition-colors ${
                    profile.style.includes(s)
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Companion */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Who are you traveling with?</h2>
            <div className="flex flex-col gap-3">
              {(
                [
                  { value: "solo", label: "Just me", emoji: "🧳" },
                  { value: "friend", label: "With friends", emoji: "👯" },
                  { value: "partner", label: "With my partner", emoji: "💑" },
                ] as const
              ).map(({ value, label, emoji }) => (
                <button
                  key={value}
                  onClick={() => setProfile((p) => ({ ...p, companion: value }))}
                  className={`w-full py-4 px-5 rounded-2xl border text-left flex items-center gap-3 transition-colors ${
                    profile.companion === value
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={back}
              className="flex-1 py-3 border border-gray-200 rounded-2xl font-medium hover:border-gray-400 transition-colors"
            >
              ← Back
            </button>
          )}
          {step < TOTAL_STEPS ? (
            <button
              onClick={next}
              className="flex-1 py-3 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Build My Itinerary ✨
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
