export default function TeamRoster({ rosters, players }: any) {
  return (
    <div className="bg-slate-800 p-4 rounded">
      <h2 className="text-xl font-bold mb-3">Team Rosters</h2>

      {rosters.map((roster: any) => (
        <div key={roster.roster_id} className="mb-4">

          <h3 className="font-semibold mb-1">
            Team {roster.roster_id}
          </h3>

          <ul className="text-sm text-gray-300">

            {roster.players?.slice(0, 8).map((playerId: string) => {

              const player = players?.[playerId]

              return (
                <li key={playerId}>
                  {player
                    ? `${player.full_name} (${player.position})`
                    : playerId}
                </li>
              )

            })}

          </ul>

        </div>
      ))}
    </div>
  )
}