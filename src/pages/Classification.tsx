import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCombinedResults, CombinedResult } from "../api/api";
import chainLeague from "../assets/chain-LEAGUE.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Classification: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<{ [key: string]: CombinedResult[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>('vol4');

  const getTopFourRoundIndices = (player: CombinedResult): number[] => {
    const rounds = [
      { value: player.points1, index: 1 },
      { value: player.points2, index: 2 },
      { value: player.points3, index: 3 },
      { value: player.points4, index: 4 },
      { value: player.points5, index: 5 },
      { value: player.points6, index: 6 },
      ...(selectedSeason === 'vol4' && player.points7 !== undefined 
        ? [{ value: player.points7, index: 7 }] 
        : []),
    ].filter((round): round is { value: number; index: number } => 
      round.value !== null && round.value !== undefined
    );

    if (rounds.length === 0) return [];

    const sortedRounds = [...rounds].sort((a, b) => b.value - a.value);
    const roundsToTake = Math.min(4, sortedRounds.length);
    return sortedRounds.slice(0, roundsToTake).map(round => round.index);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCombinedResults(selectedSeason);
        setResults(data);
        setSelectedCategory(Object.keys(data)[0] || null);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [selectedSeason]);

  const getSeasonDisplayName = (season: string): string => {
    const seasonNumber = season.replace('vol', '');
    return `vol. ${seasonNumber}`;
  };

  const getPlaceBackgroundColor = (place: number): string | undefined => {
    if (place === 1) return 'rgba(255, 215, 0, 0.5)';
    if (place === 2) return 'rgba(192, 192, 192, 0.5)';
    if (place === 3) return 'rgba(205, 127, 50, 0.5)';
    return undefined;
  };

  const adjustVol3Results = (categoryResults: CombinedResult[]): CombinedResult[] => {
    if (selectedSeason !== 'vol3') return categoryResults;

    const mateusz = categoryResults.find(p => p.name === 'Mateusz Nitka');
    const filip = categoryResults.find(p => p.name === 'Filip Górski');
    
    if (!mateusz || !filip) return categoryResults;

    const playersToMoveDown = categoryResults.filter(
      p => (p.place === 2 || p.place === 3) && p.name !== 'Mateusz Nitka' && p.name !== 'Filip Górski'
    );

    const sortedToMoveDown = [...playersToMoveDown].sort((a, b) => a.place - b.place);

    const placeMapping = new Map<string, number>();
    let nextPlace = 4;
    sortedToMoveDown.forEach(player => {
      placeMapping.set(player.name, nextPlace);
      nextPlace++;
    });
    
    const adjusted = categoryResults.map(player => {
      if (player.name === 'Mateusz Nitka') {
        return { ...player, place: 2 };
      }
      if (player.name === 'Filip Górski') {
        return { ...player, place: 3 };
      }
      // Apply new place if player needs to be moved down
      const newPlace = placeMapping.get(player.name);
      if (newPlace !== undefined) {
        return { ...player, place: newPlace };
      }
      return player;
    });

    return adjusted.sort((a, b) => a.place - b.place);
  };

  const cardClass =
    "w-full rounded-3xl bg-[#fefefe]/95 border border-[#c1d8cf]/40 shadow-[0_8px_32px_rgba(15,61,64,0.2)]";
  const toggleBase =
    "rounded-xl border-2 border-[#c1d8cf]/50 text-[#31666a] text-sm font-semibold transition-all bg-transparent";
  const toggleHover = "hover:border-[#4d8686]/70 hover:bg-[#def0ef]/30";
  const toggleSelected =
    "bg-gradient-to-r from-[#4d8686] via-[#31666a] to-[#215356] text-white border-transparent shadow-[0_4px_12px_rgba(33,83,86,0.4)]";

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

      <div className={`${cardClass} mx-auto max-w-[900px] p-4 sm:p-6 mb-4`}>
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-transparent bg-clip-text bg-[#215356] text-2xl sm:text-3xl md:text-4xl font-bold">
            Chain Reaction League {getSeasonDisplayName(selectedSeason)}
          </h1>
          <div className="flex flex-col gap-2 w-full items-center">
            <div className="flex flex-wrap justify-center w-full gap-2">
              {["vol1", "vol2", "vol3", "vol4"].map((season) => (
                <button
                  key={season}
                  type="button"
                  onClick={() => setSelectedSeason(season)}
                  className={`${toggleBase} ${toggleHover} ${
                    selectedSeason === season ? toggleSelected : ""
                  } flex-1 sm:flex-none min-w-[110px] px-3 py-2 text-center`}
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
                    className={`${toggleBase} ${toggleHover} ${
                      selectedCategory === category ? toggleSelected : ""
                    } flex-1 sm:flex-none min-w-[140px] px-3 py-2 text-center`}
                  >
                    {category}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-[360px] sm:min-w-[640px] md:min-w-[700px] w-full text-[11px] sm:text-sm">
            <thead>
              <tr>
                <th className="bg-[#31666a] text-[#fefefe] font-semibold tracking-wide px-2 sm:px-4 py-2 sm:py-3">Miejsce</th>
                <th className="bg-[#31666a] text-[#fefefe] font-semibold tracking-wide px-2 sm:px-4 py-2 sm:py-3">Gracz</th>
                <th className="bg-[#31666a] text-[#fefefe] font-semibold tracking-wide px-2 sm:px-4 py-2 sm:py-3 text-center">#1</th>
                <th className="bg-[#31666a] text-[#fefefe] font-semibold tracking-wide px-2 sm:px-4 py-2 sm:py-3 text-center">#2</th>
                <th className="hidden sm:table-cell bg-[#31666a] text-[#fefefe] font-semibold tracking-wide px-2 sm:px-4 py-2 sm:py-3 text-center">#3</th>
                <th className="hidden sm:table-cell bg-[#31666a] text-[#fefefe] font-semibold tracking-wide px-2 sm:px-4 py-2 sm:py-3 text-center">#4</th>
                <th className="hidden sm:table-cell bg-[#31666a] text-[#fefefe] font-semibold tracking-wide px-2 sm:px-4 py-2 sm:py-3 text-center">#5</th>
                <th className="hidden sm:table-cell bg-[#31666a] text-[#fefefe] font-semibold tracking-wide px-2 sm:px-4 py-2 sm:py-3 text-center">#6</th>
                {selectedSeason === "vol4" && (
                  <th className="hidden sm:table-cell bg-[#31666a] text-[#fefefe] font-semibold tracking-wide px-2 sm:px-4 py-2 sm:py-3 text-center">#7</th>
                )}
                <th className="bg-[#31666a] text-[#fefefe] font-semibold tracking-wide px-2 sm:px-4 py-2 sm:py-3 text-center">Suma</th>
              </tr>
            </thead>
            <tbody>
              {results &&
                selectedCategory &&
                adjustVol3Results(results[selectedCategory] || []).map((player, index) => {
                  const topFourIndices = getTopFourRoundIndices(player);
                  const isTopFour = (roundNum: number) => topFourIndices.includes(roundNum);
                  const placeBgColor = getPlaceBackgroundColor(player.place);
                  const rowClass = placeBgColor ? "" : index % 2 === 1 ? "bg-[#def0ef]/30" : "";
                  return (
                    <tr
                      key={player.name}
                      className={`${rowClass} hover:bg-[#c1d8cf]/50 transition`}
                      style={placeBgColor ? { backgroundColor: placeBgColor } : undefined}
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-[#0f3d40]">{player.place}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-[#0f3d40]">{player.name}</td>
                      <td className={`px-2 sm:px-4 py-2 sm:py-3 text-center text-[#0f3d40] ${isTopFour(1) ? "font-semibold" : "font-normal"}`}>{player.points1 ?? "-"}</td>
                      <td className={`px-2 sm:px-4 py-2 sm:py-3 text-center text-[#0f3d40] ${isTopFour(2) ? "font-semibold" : "font-normal"}`}>{player.points2 ?? "-"}</td>
                      <td className={`hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-center text-[#0f3d40] ${isTopFour(3) ? "font-semibold" : "font-normal"}`}>{player.points3 ?? "-"}</td>
                      <td className={`hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-center text-[#0f3d40] ${isTopFour(4) ? "font-semibold" : "font-normal"}`}>{player.points4 ?? "-"}</td>
                      <td className={`hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-center text-[#0f3d40] ${isTopFour(5) ? "font-semibold" : "font-normal"}`}>{player.points5 ?? "-"}</td>
                      <td className={`hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-center text-[#0f3d40] ${isTopFour(6) ? "font-semibold" : "font-normal"}`}>{player.points6 ?? "-"}</td>
                      {selectedSeason === "vol4" && (
                        <td className={`hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-center text-[#0f3d40] ${isTopFour(7) ? "font-semibold" : "font-normal"}`}>{player.points7 ?? "-"}</td>
                      )}
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-[#0f3d40]">{player.totalPoints}</td>
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
