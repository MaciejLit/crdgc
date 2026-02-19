import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCombinedResults, CombinedResult } from "../api/api";
import chainLeague from "../assets/chain-LEAGUE.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const SEASONS = ["vol1", "vol2", "vol3", "vol4"] as const;
const BEST_ROUNDS_VOL4 = 5;
const BEST_ROUNDS_DEFAULT = 4;

const PLACE_COLORS: Record<number, string> = {
  1: "rgba(255, 215, 0, 0.5)",
  2: "rgba(192, 192, 192, 0.5)",
  3: "rgba(205, 127, 50, 0.5)",
};

const CARD_CLASS =
  "w-full rounded-3xl bg-[#fefefe]/95 border border-[#c1d8cf]/40 shadow-[0_8px_32px_rgba(15,61,64,0.2)]";
const TOGGLE_BASE =
  "rounded-xl border-2 border-[#c1d8cf]/50 text-[#31666a] text-sm font-semibold transition-all bg-transparent";
const TOGGLE_HOVER = "hover:border-[#4d8686]/70 hover:bg-[#def0ef]/30";
const TOGGLE_SELECTED =
  "bg-gradient-to-r from-[#4d8686] via-[#31666a] to-[#215356] text-white border-transparent shadow-[0_4px_12px_rgba(33,83,86,0.4)]";
const TH_CLASS =
  "bg-[#31666a] text-[#fefefe] font-semibold tracking-wide px-2 sm:px-4 py-2 sm:py-3";
const TD_CLASS = "px-2 sm:px-4 py-2 sm:py-3 text-[#0f3d40]";
const TD_CENTER = "text-center";

function getRoundEntries(player: CombinedResult, season: string): { value: number; index: number }[] {
  const base = [
    { value: player.points1, index: 1 },
    { value: player.points2, index: 2 },
    { value: player.points3, index: 3 },
    { value: player.points4, index: 4 },
    { value: player.points5, index: 5 },
    { value: player.points6, index: 6 },
  ];
  const withVol4 =
    season === "vol4" && player.points7 != null
      ? [...base, { value: player.points7!, index: 7 }]
      : base;
  return withVol4.filter(
    (r): r is { value: number; index: number } => r.value != null
  );
}

function getBestRoundIndices(player: CombinedResult, season: string): number[] {
  const rounds = getRoundEntries(player, season);
  if (rounds.length === 0) return [];
  const count = season === "vol4" ? BEST_ROUNDS_VOL4 : BEST_ROUNDS_DEFAULT;
  const sorted = [...rounds].sort((a, b) => b.value - a.value);
  return sorted.slice(0, Math.min(count, sorted.length)).map((r) => r.index);
}

function sortByTotalPoints(players: CombinedResult[]): CombinedResult[] {
  const sorted = [...players].sort((a, b) => b.totalPoints - a.totalPoints);
  return sorted.map((p, i) => ({ ...p, place: i + 1 }));
}

const Classification: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<{
    [key: string]: CombinedResult[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>("vol4");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCombinedResults(selectedSeason)
      .then((data) => {
        if (!cancelled) {
          setResults(data);
          setSelectedCategory(Object.keys(data)[0] ?? null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError("Failed to load data");
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedSeason]);

  const seasonLabel = `vol. ${selectedSeason.replace("vol", "")}`;
  const categoryPlayers =
    results && selectedCategory
      ? sortByTotalPoints(results[selectedCategory] ?? [])
      : [];

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-8 pb-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full border-4 border-[#215356] border-t-transparent animate-spin" />
          <p className="text-[#215356] font-medium">Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-8 pb-8">
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  const toggleClass = (active: boolean) =>
    `${TOGGLE_BASE} ${TOGGLE_HOVER} ${active ? TOGGLE_SELECTED : ""} flex-1 sm:flex-none min-w-[110px] px-3 py-2 text-center`;
  const categoryToggleClass = (active: boolean) =>
    `${TOGGLE_BASE} ${TOGGLE_HOVER} ${active ? TOGGLE_SELECTED : ""} flex-1 sm:flex-none min-w-[140px] px-3 py-2 text-center`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-8 pb-8">
      <div className="w-full grid grid-cols-[44px_1fr_44px] items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Powrot do strony glownej"
          className="h-11 w-11 rounded-full bg-[#31666a] text-[#fefefe] shadow-[0_6px_16px_rgba(15,61,64,0.3)] flex items-center justify-center hover:bg-[#215356] transition text-xl"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <img
          src={chainLeague}
          alt="CRDGC Logo"
          className="h-36 sm:h-44 md:h-56 w-full max-w-[500px] object-contain mx-auto"
        />
        <div aria-hidden="true" />
      </div>

      <div className={`${CARD_CLASS} mx-auto max-w-[900px] p-4 sm:p-6 mb-4`}>
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-transparent bg-clip-text bg-[#215356] text-2xl sm:text-3xl md:text-4xl font-bold">
            Chain Reaction League {seasonLabel}
          </h1>
          <div className="flex flex-col gap-2 w-full items-center">
            <div className="flex flex-wrap justify-center w-full gap-2">
              {SEASONS.map((season) => (
                <button
                  key={season}
                  type="button"
                  onClick={() => setSelectedSeason(season)}
                  className={toggleClass(selectedSeason === season)}
                >
                  {season.replace("vol", "Vol. ")}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center w-full gap-2">
              {results &&
                Object.keys(results).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={categoryToggleClass(selectedCategory === category)}
                  >
                    {category}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`${CARD_CLASS} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-[360px] sm:min-w-[640px] md:min-w-[700px] w-full text-[11px] sm:text-sm">
            <thead>
              <tr>
                <th className={`${TH_CLASS}`}>Miejsce</th>
                <th className={TH_CLASS}>Gracz</th>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <th
                    key={n}
                    className={`${TH_CLASS} ${TD_CENTER} ${n >= 3 ? "hidden sm:table-cell" : ""}`}
                  >
                    #{n}
                  </th>
                ))}
                {selectedSeason === "vol4" && (
                  <th className={`${TH_CLASS} ${TD_CENTER} hidden sm:table-cell`}>
                    #7
                  </th>
                )}
                <th className={`${TH_CLASS} ${TD_CENTER}`}>Suma</th>
              </tr>
            </thead>
            <tbody>
              {categoryPlayers.map((player, index) => {
                const bestIndices = getBestRoundIndices(player, selectedSeason);
                const isCounting = (n: number) => bestIndices.includes(n);
                const placeBg = PLACE_COLORS[player.place];
                const rowBg =
                  placeBg ?? (index % 2 === 1 ? "bg-[#def0ef]/30" : "");
                const points: (number | null | undefined)[] = [
                  player.points1,
                  player.points2,
                  player.points3,
                  player.points4,
                  player.points5,
                  player.points6,
                ];
                if (selectedSeason === "vol4") points.push(player.points7);

                return (
                  <tr
                    key={player.name}
                    className={`${rowBg} hover:bg-[#c1d8cf]/50 transition`}
                    style={placeBg ? { backgroundColor: placeBg } : undefined}
                  >
                    <td className={`${TD_CLASS} font-semibold`}>
                      {player.place}
                    </td>
                    <td className={`${TD_CLASS} font-semibold`}>
                      {player.name}
                    </td>
                    {points.map((pt, i) => (
                      <td
                        key={i}
                        className={`${TD_CLASS} ${TD_CENTER} ${i >= 2 ? "hidden sm:table-cell" : ""} ${isCounting(i + 1) ? "font-semibold" : "font-normal"}`}
                      >
                        {pt ?? "-"}
                      </td>
                    ))}
                    <td
                      className={`${TD_CLASS} ${TD_CENTER} font-semibold`}
                    >
                      {player.totalPoints}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Classification;
