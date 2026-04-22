export async function getPlayerValueMap(): Promise<Map<string, number>> {
  try {
    const res = await fetch("http://localhost:3000/api/player-values", {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return new Map();

    const data = await res.json();
    const valueMap = new Map<string, number>();

    for (const [sleeperId, player] of Object.entries(data) as any[]) {
      // Use search_rank as a proxy for value (lower = better, so invert it)
      const rank = player?.search_rank ?? 9999;
      const value = Math.max(0, 10000 - rank * 10);
      valueMap.set(sleeperId, value);
    }

    return valueMap;
  } catch (err) {
    console.error("Failed to load player values:", err);
    return new Map();
  }
}