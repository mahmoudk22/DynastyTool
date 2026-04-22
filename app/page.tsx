"use client";

import { error } from "console";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [leagues, setLeagues] = useState<any[]>([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [rosters, setRosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLeagues([]);
    setRosters([]);
    setSelectedLeague("");

    try {
      // 1️⃣ Get user from username
      const userRes = await fetch(
        `https://api.sleeper.app/v1/user/${username}`
      );

      if (!userRes.ok) {
        throw new Error("User not found");
      }

      const userData = await userRes.json();
      const userId = userData.user_id;

      // 2️⃣ Get leagues for multiple seasons
      const currentYear = new Date().getFullYear();
      const seasons: string[] = [];

      for (let year = 2020; year <= currentYear; year++) {
        seasons.push(year.toString());
      }

      const leaguePromises = seasons.map((season) =>
        fetch(
          `https://api.sleeper.app/v1/user/${userId}/leagues/nfl/${season}`
        ).then((res) => {
          if (!res.ok) return [];
          return res.json();
        })
      );

      const leaguesBySeason = await Promise.all(leaguePromises);
      const allLeagues = leaguesBySeason.flat();

      setLeagues(allLeagues);

    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  async function fetchRosters(leagueId: string) {
    try {
      const res = await fetch(
        `https://api.sleeper.app/v1/league/${leagueId}/rosters`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch rosters");
      }

      const data = await res.json();
      setRosters(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <main style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h1 className="title">Dynasty Tool</h1>

      {/* USER SEARCH */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Sleeper Username"
          className="input-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        />
        <button type="submit" style={{ padding: "10px", width: "100%" }} className="submit-button">
          Find My Leagues
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* DROPDOWN */}
      {leagues.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Select a League</h2>

          <select
            value={selectedLeague}
            onChange={(e) => {
              const leagueId = e.target.value;

              if (leagueId) {
                // Open league in new page
                router.push('/league/' + leagueId);
                return;
              }
              setSelectedLeague(e.target.value);
              fetchRosters(e.target.value);
            }}
            style={{ padding: "10px", width: "100%" }}
          >
            <option value="" className="dropdown">-- Choose a League --</option>

            {leagues.map((league) => (
              <option key={league.league_id} value={league.league_id}>
                {league.name} ({league.season})
              </option>
            ))}
          </select>
        </div>
      )}</main>
  );


      {/* OPEN NEW TAB WITH LEAGUE */}
      
}