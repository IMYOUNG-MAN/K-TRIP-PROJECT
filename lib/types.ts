export interface QuizProfile {
  dramas: string[];
  kpop: string[];
  duration: "3" | "5" | "7";
  style: string[];
  companion: "solo" | "friend" | "partner";
}

export interface SlotItem {
  time: "morning" | "afternoon" | "evening";
  location: string;
  address: string;
  fandom_connection: string;
  tip: string;
}

export interface DayPlan {
  day: number;
  theme: string;
  slots: SlotItem[];
}

export interface Itinerary {
  profile_summary: string;
  days: DayPlan[];
  bonus_spots: { location: string; why: string }[];
}
