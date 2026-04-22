import PowerRankings from "../../components/PowerRankings";
import LeagueMembers from "../../components/LeagueMembers";
import TeamRoster from "../../components/TeamRoster";
import { getPlayerValueMap } from "../../lib/playerValues";
import { getLeagueRosters, getLeagueUsers, getPlayers, getPlayerPositions } from "../../lib/sleeper";

export default async function LeaguePage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  const rosters = await getLeagueRosters(leagueId);
  const users = await getLeagueUsers(leagueId);
  const players = await getPlayers();
  const valueMap = await getPlayerValueMap();
  const positionMap = await getPlayerPositions();

  return (
    <div className="p-10 bg-slate-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">League Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <LeagueMembers users={users} />
        <TeamRoster rosters={rosters} players={players} />
      </div>

      <PowerRankings
        rosters={rosters}
        players={players}
        values={valueMap}
        users={users}
        positions={positionMap}
      />
    </div>
  );
}