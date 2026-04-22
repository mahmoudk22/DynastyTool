"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getUser, getLeagues } from "../../lib/sleeper"

export default function LeaguesPage() {
  const params = useSearchParams()
  const router = useRouter()
  const username = params.get("username")

  const [leagues, setLeagues] = useState([])

  useEffect(() => {
    async function load() {
      const user = await getUser(username!)
      const leagues = await getLeagues(user.user_id)
      setLeagues(leagues)
    }

    load()
  }, [])

  const handleSelect = (leagueId: string) => {
    router.push(`/league/${leagueId}`)
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Select League</h1>

      <select
        className="border p-2 rounded"
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option>Select League</option>

        {leagues.map((league: any) => (
          <option key={league.league_id} value={league.league_id}>
            {league.name}
          </option>
        ))}
      </select>
    </div>
  )
}