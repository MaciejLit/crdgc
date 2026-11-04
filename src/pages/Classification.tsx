import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { fetchCombinedResults, CombinedResult } from "../api/api";
import PageShell from "../components/PageShell";
import SeasonSelect from "../components/SeasonSelect";

interface Season {
  id: string;
  label: string;
  rounds: number;
  bestRounds: number;
}

const SEASONS: Season[] = [
  { id: "vol5", label: "2026/2027", rounds: 7, bestRounds: 5 },
  { id: "vol4", label: "2025/2026", rounds: 7, bestRounds: 5 },
  { id: "vol3", label: "2024/2025", rounds: 6, bestRounds: 4 },
  { id: "vol2", label: "2023/2024", rounds: 6, bestRounds: 4 },
  { id: "vol1", label: "2022/2023", rounds: 6, bestRounds: 4 },
];

// Krótkie nazwy kategorii do zakładek; pełna nazwa jest w nagłówku sekcji
const CATEGORY_SHORT: Record<string, string> = {
  "Women's Pro Open": "FPO",
  "Pro Master 40+": "MP40",
  "Mixed Amateur 3": "MA3",
  "Mixed Amateur 4": "MA4",
};

function shortCategoryName(name: string): string {
  return CATEGORY_SHORT[name] ?? name.match(/\bRA[A-Z]\b/)?.[0] ?? name;
}

function getRoundPoints(player: CombinedResult, rounds: number): (number | null)[] {
  const all = [
    player.points1,
    player.points2,
    player.points3,
    player.points4,
    player.points5,
    player.points6,
    player.points7 ?? null,
  ];
  return all.slice(0, rounds);
}

function getBestRoundIndices(points: (number | null)[], count: number): Set<number> {
  const best = points
    .map((value, index) => ({ value, index }))
    .filter((r): r is { value: number; index: number } => r.value != null)
    .sort((a, b) => b.value - a.value)
    .slice(0, count)
    .map((r) => r.index);
  return new Set(best);
}

function sortByTotalPoints(players: CombinedResult[]): CombinedResult[] {
  const sorted = [...players].sort((a, b) => b.totalPoints - a.totalPoints);
  return sorted.map((p, i) => ({ ...p, place: i + 1 }));
}

const CARD_CLASS = "rounded-2xl bg-brand-cream shadow-[0_8px_24px_rgba(15,37,36,0.25)]";
const TH_CLASS = "px-4 py-3 text-left text-xs font-medium text-brand-ink whitespace-nowrap";
const TD_CLASS = "px-4 py-3 text-xs sm:text-sm text-brand-ink whitespace-nowrap";

const Classification: React.FC = () => {
  const [results, setResults] = useState<{ [key: string]: CombinedResult[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>(SEASONS[0].id);
  const [overflowing, setOverflowing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const season = SEASONS.find((s) => s.id === selectedSeason) ?? SEASONS[0];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCombinedResults(selectedSeason)
      .then((data) => {
        if (cancelled) return;
        setResults(data);
        // Zostajemy w tej samej kategorii przy zmianie sezonu, jeśli istnieje
        setSelectedCategory((prev) =>
          prev && prev in data ? prev : Object.keys(data)[0] ?? null
        );
      })
      .catch((err) => {
        if (!cancelled) setError("Nie udało się pobrać wyników.");
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedSeason]);

  const categoryPlayers =
    results && selectedCategory ? sortByTotalPoints(results[selectedCategory] ?? []) : [];

  // Podpowiedź o przewijaniu pokazujemy tylko, gdy tabela faktycznie się nie mieści
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [categoryPlayers.length, season.rounds, loading]);

  const tabs = results
    ? Object.keys(results).map((category) => ({ id: category, label: shortCategoryName(category) }))
    : [];

  return (
    <PageShell
      title="Liga Zimowa"
      tabs={tabs}
      activeTab={selectedCategory}
      onTabChange={setSelectedCategory}
    >
      <h2 className="mb-6 text-center text-xl sm:text-2xl font-semibold text-white drop-shadow">
        {selectedCategory ?? "Chain Reaction League"}
      </h2>

      <div className={`${CARD_CLASS} p-4 sm:p-5 mb-6 sm:max-w-sm sm:mx-auto`}>
        <SeasonSelect
          label="Sezon"
          value={selectedSeason}
          options={SEASONS.map((s) => ({ value: s.id, label: s.label }))}
          onChange={setSelectedSeason}
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      ) : (
        <>
          <div className={`${CARD_CLASS} overflow-hidden`}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="mb-3 h-10 w-10 rounded-full border-4 border-brand-green border-t-transparent animate-spin" />
                <p className="text-sm text-brand-ink">Ładowanie danych...</p>
              </div>
            ) : categoryPlayers.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-brand-ink">
                Brak wyników w tej kategorii.
              </p>
            ) : (
              <div ref={scrollRef} className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-brand-line">
                      <th className={`${TH_CLASS} sticky left-0 z-10 bg-brand-line min-w-[170px] sm:min-w-[200px]`}>
                        Zawodnik
                      </th>
                      <th className={TH_CLASS}>Suma</th>
                      {Array.from({ length: season.rounds }, (_, i) => (
                        <th key={i} className={TH_CLASS}>
                          Kolejka #{i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {categoryPlayers.map((player) => {
                      const points = getRoundPoints(player, season.rounds);
                      const best = getBestRoundIndices(points, season.bestRounds);
                      return (
                        <tr
                          key={player.name}
                          className="group border-t border-brand-line hover:bg-brand-sky/40 transition-colors"
                        >
                          <td className={`${TD_CLASS} sticky left-0 z-10 bg-brand-cream group-hover:bg-[#e3f2ee] transition-colors`}>
                            {player.place}. {player.name}
                          </td>
                          <td className={`${TD_CLASS} font-semibold`}>{player.totalPoints}</td>
                          {points.map((pt, i) => (
                            <td
                              key={i}
                              className={`${TD_CLASS} ${best.has(i) ? "font-semibold" : "text-brand-ink/60"}`}
                            >
                              {pt ?? "-"}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/90">
            <span>
              Do sumy liczy się {season.bestRounds} najlepszych kolejek (pogrubione).
            </span>
            {overflowing && <span>Skroluj w bok, żeby zobaczyć całość wyników →</span>}
          </div>
        </>
      )}
    </PageShell>
  );
};

export default Classification;
