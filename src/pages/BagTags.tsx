import { useState } from "react";
import { BagTagsResponse, MemberResult } from "../api/types";
import PageShell from "../components/PageShell";

const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

const CARD_CLASS = "rounded-2xl bg-brand-cream shadow-[0_8px_24px_rgba(15,37,36,0.25)]";

const BagTags: React.FC = () => {
  const [tournamentId, setTournamentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MemberResult[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = tournamentId.trim();
    if (!trimmed) {
      setError("Podaj numer turnieju z DiscGolfMetrix.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(`${API_BASE_URL}/crdgc-bag-tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tournamentId: trimmed }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się pobrać wyników.");
      }

      const data: BagTagsResponse | MemberResult[] = await response.json();
      const members = Array.isArray(data)
        ? data
        : data.members || data.results || [];

      if (!Array.isArray(members)) {
        throw new Error("Niepoprawny format odpowiedzi API.");
      }

      setResults(members);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Wystąpił błąd.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="CRDGC BagTag's">
      <div className={`${CARD_CLASS} p-4 sm:p-6`}>
        <p className="text-sm text-brand-ink">
          Wpisz numer turnieju z DiscGolfMetrix, aby ustawić kolejność BagTagów według wyników
          klubowiczów.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
          <label className="flex-1">
            <span className="block mb-1.5 text-xs text-brand-ink">Numer turnieju</span>
            <input
              type="text"
              value={tournamentId}
              onChange={(event) => setTournamentId(event.target.value)}
              placeholder="np. 437198"
              className="w-full rounded-lg border border-[#b9c7b5] bg-white px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/40"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="self-stretch sm:self-end rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(55,147,144,0.4)] transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Ładowanie..." : "Pobierz wyniki"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className={`${CARD_CLASS} mt-6 overflow-hidden`}>
        <div className="bg-brand-line px-4 py-3 text-xs font-medium text-brand-ink">
          Ranking klubowiczów
        </div>
        {results.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-brand-ink/80">
            Brak wyników do wyświetlenia. Wpisz numer turnieju.
          </p>
        ) : (
          <ul>
            {results.map((entry, index) => (
              <li
                key={`${entry.name}-${index}`}
                className="flex items-center justify-between border-t border-brand-line px-4 py-3 text-sm text-brand-ink"
              >
                <span className="font-medium">
                  {index + 1}. {entry.name}
                </span>
                <span className="text-brand-ink/70">
                  {entry.totalScore !== null ? `Suma rzutów: ${entry.totalScore}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
};

export default BagTags;
