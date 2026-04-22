import { getUser, getLeagues } from "../lib/sleeper"
import Link from "next/link"

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { username?: string }
}) {
  const username = searchParams.username

  if (!username) {
    return (
      <div className="p-10 text-white bg-slate-900 min-h-screen">
        <h1 className="text-3xl font-bold">Dynasty Tool</h1>
        <p className="mt-4">No username provided.</p>
        <p>Go back and enter your Sleeper username.</p>
      </div>
    )
  }

  const user = await getUser(username)
  const leagues = await getLeagues(user.user_id)

  return (
    <div className="p-10 bg-slate-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        {username}'s Leagues
      </h1>

      <div className="grid gap-4 max-w-xl">
        {leagues.map((league: any) => (
          <Link
            key={league.league_id}
            href={`/league/${league.league_id}`}
            className="bg-slate-800 p-4 rounded hover:bg-slate-700 transition"
          >
            <h2 className="text-xl font-semibold">
              {league.name}
            </h2>

            <p className="text-gray-400 text-sm">
              {league.total_rosters} teams
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}