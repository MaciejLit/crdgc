import { useState } from "react";

type MemberResult = {
  name: string;
  place: number | null;
  totalScore: number | null;
};

type BagTagsResponse = {
  members?: MemberResult[];
  results?: MemberResult[];
  missingMembers?: string[];
};

const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

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
  console.log(results);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Wystąpił błąd.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 pt-8 pb-8">
      <div className="rounded-3xl border border-[#c1d8cf]/40 bg-[#def0ef]/25 backdrop-blur-xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(15,61,64,0.3)]">
        <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-[#215356]">
          CRDGC BagTag's
        </h1>
        <p className="text-sm sm:text-base text-[#0f3d40] font-medium">
          Wpisz numer turnieju z DiscGolfMetrix, aby ustawić kolejność BagTagów według wyników
          klubowiczów.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={tournamentId}
            onChange={(event) => setTournamentId(event.target.value)}
            placeholder="np. 437198"
            className="flex-1 rounded-2xl border border-[#c1d8cf]/60 bg-white/80 px-4 py-2 text-[#0f3d40] placeholder:text-[#749898] focus:outline-none focus:ring-2 focus:ring-[#4d8686]/40"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl px-5 py-2.5 text-sm sm:text-base font-semibold text-[#0f3d40] bg-gradient-to-br from-[#def0ef] via-[#c1d8cf] to-[#95b9b8] shadow-[0_4px_16px_rgba(15,61,64,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,61,64,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Ładowanie..." : "Pobierz wyniki"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4">
        <div className="rounded-3xl border border-[#c1d8cf]/40 bg-[#fefefe]/95 p-4 sm:p-6 shadow-[0_8px_32px_rgba(15,61,64,0.2)]">
          <h2 className="text-lg sm:text-xl font-semibold text-[#215356]">Ranking klubowiczów</h2>
          {results.length === 0 ? (
            <p className="mt-3 text-sm text-[#0f3d40]">
              Brak wyników do wyświetlenia. Wpisz numer turnieju.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {results.map((entry, index) => (
                <li
                  key={`${entry.name}-${index}`}
                  className="flex items-center justify-between rounded-2xl bg-[#def0ef]/40 px-4 py-2 text-sm sm:text-base"
                >
                  <span className="font-semibold text-[#0f3d40]">
                    {index + 1}. {entry.name}
                  </span>
                  <span className="text-[#31666a] font-medium">
                    {entry.totalScore !== null ? `Suma rzutów: ${entry.totalScore}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BagTags;
