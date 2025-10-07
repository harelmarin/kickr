import { Match } from "@/types/Match";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function getMatches(): Promise<Match[]> {
  const res = await fetch(`${API_URL}/matches`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch matches");
  }

  return res.json();
}
