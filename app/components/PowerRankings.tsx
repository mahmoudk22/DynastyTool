"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const POS_COLORS: Record<string, string> = {
  QB: "#378ADD",
  RB: "#1D9E75",
  WR: "#D85A30",
  TE: "#7F77DD",
  OTHER: "#888780",
};

function tierLabel(rank: number, total: number) {
  if (rank <= Math.floor(total / 3)) return { label: "Contender", bg: "#E1F5EE", color: "#0F6E56" };
  if (rank <= Math.floor((total * 2) / 3)) return { label: "Frisky", bg: "#FAEEDA", color: "#854F0B" };
  return { label: "Rebuilding", bg: "#FCEBEB", color: "#A32D2D" };
}

function pillColor(rank: number, total: number) {
  if (rank <= Math.floor(total / 3)) return { bg: "#EAF3DE", color: "#3B6D11" };
  if (rank <= Math.floor((total * 2) / 3)) return { bg: "#FAEEDA", color: "#854F0B" };
  return { bg: "#FCEBEB", color: "#A32D2D" };
}

export default function PowerRankings({ rosters, players, values, users, positions }: any) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  const userMap = new Map<string, string>();
  for (const user of users) {
    userMap.set(user.user_id, user.display_name);
  }

  const rankings = rosters
    .map((roster: any) => {
      const breakdown = { QB: 0, RB: 0, WR: 0, TE: 0, OTHER: 0 };
      for (const playerId of roster.players ?? []) {
        const pos = positions?.get(playerId) ?? "OTHER";
        const val = values.get(playerId) ?? 0;
        const key = ["QB", "RB", "WR", "TE"].includes(pos) ? pos : "OTHER";
        breakdown[key as keyof typeof breakdown] += val;
      }
      const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
      return {
        team: userMap.get(roster.owner_id) ?? `Team ${roster.roster_id}`,
        total,
        ...breakdown,
      };
    })
    .sort((a: any, b: any) => b.total - a.total);

  const n = rankings.length;

  function posRank(key: string) {
    const sorted = [...rankings].sort((a: any, b: any) => b[key] - a[key]);
    return rankings.map((r: any) => sorted.findIndex((s: any) => s.team === r.team) + 1);
  }

  const qbRanks = posRank("QB");
  const rbRanks = posRank("RB");
  const wrRanks = posRank("WR");
  const teRanks = posRank("TE");

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: rankings.map((r: any) => r.team),
        datasets: [
          { label: "QB",    data: rankings.map((r: any) => r.QB),    backgroundColor: POS_COLORS.QB },
          { label: "RB",    data: rankings.map((r: any) => r.RB),    backgroundColor: POS_COLORS.RB },
          { label: "WR",    data: rankings.map((r: any) => r.WR),    backgroundColor: POS_COLORS.WR },
          { label: "TE",    data: rankings.map((r: any) => r.TE),    backgroundColor: POS_COLORS.TE },
          { label: "Other", data: rankings.map((r: any) => r.OTHER), backgroundColor: POS_COLORS.OTHER },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.raw.toLocaleString()}`,
            },
          },
        },
        scales: {
          x: { stacked: true, ticks: { color: "#888", font: { size: 11 } }, grid: { display: false } },
          y: { stacked: true, ticks: { color: "#888", callback: (v: any) => (v / 1000).toFixed(0) + "k" }, grid: { color: "rgba(128,128,128,0.12)" } },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [rankings]);

  return (
    <div className="bg-slate-800 p-4 rounded col-span-3">
      <h2 className="text-xl font-bold mb-4">Power Rankings</h2>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap mb-3 text-xs text-gray-400">
        {Object.entries(POS_COLORS).map(([pos, color]) => (
          <span key={pos} className="flex items-center gap-1">
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: "inline-block" }} />
            {pos}
          </span>
        ))}
      </div>

      {/* Stacked bar chart */}
      <div style={{ position: "relative", height: `${n * 42 + 60}px`, marginBottom: "2rem" }}>
        <canvas ref={chartRef} />
      </div>

      {/* Rankings table */}
      <div className="overflow-x-auto rounded border border-slate-700">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-slate-700">
              <th className="text-left p-2 w-8">#</th>
              <th className="text-left p-2">Team</th>
              <th className="text-left p-2">Tier</th>
              <th className="text-center p-2">Overall</th>
              <th className="text-center p-2">QB</th>
              <th className="text-center p-2">RB</th>
              <th className="text-center p-2">WR</th>
              <th className="text-center p-2">TE</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((r: any, i: number) => {
              const tier = tierLabel(i + 1, n);
              return (
                <tr key={r.team} className="border-b border-slate-700 hover:bg-slate-700 transition-colors">
                  <td className="p-2 text-gray-400">{i + 1}</td>
                  <td className="p-2 font-medium">{r.team}</td>
                  <td className="p-2">
                    <span style={{ background: tier.bg, color: tier.color, fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>
                      {tier.label}
                    </span>
                  </td>
                  {[i + 1, qbRanks[i], rbRanks[i], wrRanks[i], teRanks[i]].map((rank, j) => {
                    const p = pillColor(rank, n);
                    return (
                      <td key={j} className="p-2 text-center">
                        <span style={{ background: p.bg, color: p.color, width: 24, height: 24, borderRadius: 4, fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                          {rank}
                        </span>
                      </td>
                    );
                  })}
                  <td className="p-2 text-right font-medium">{r.total.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}