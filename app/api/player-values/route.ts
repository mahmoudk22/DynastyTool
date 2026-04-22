import { NextResponse } from "next/server";

export async function GET() {
  // Sleeper's player endpoint is fully open, no auth, no blocking
  const res = await fetch("https://api.sleeper.app/v1/players/nfl", {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed" }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}