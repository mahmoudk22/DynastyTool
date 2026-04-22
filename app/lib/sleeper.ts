export async function getLeagueRosters(leagueId: string) {
  const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
  return res.json();
}

export async function getLeagueUsers(leagueId: string) {
  const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
  return res.json();
}

export async function getPlayers(): Promise<Record<string, any>> {
  const res = await fetch("https://api.sleeper.app/v1/players/nfl", {
    next: { revalidate: 86400 },
  });
  return res.json();
}

export async function getPlayerPositions(): Promise<Map<string, string>> {
  const data = await getPlayers();
  const map = new Map<string, string>();
  for (const [id, player] of Object.entries(data)) {
    map.set(id, (player as any)?.position ?? "OTHER");
  }
  return map;
}

export async function getUser(username: string) {
  const res = await fetch(`https://api.sleeper.app/v1/user/${username}`);
  return res.json();
}

export async function getLeagues(userId: string) {
  const res = await fetch(
    `https://api.sleeper.app/v1/user/${userId}/leagues/nfl/2025`
  );
  return res.json();
}