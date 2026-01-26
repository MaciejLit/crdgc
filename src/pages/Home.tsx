import { useNavigate } from "react-router-dom";
import crdgcLogo from "../assets/crdgcLogo.png";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/classification");
  };

  const handleBagTagsClick = () => {
    navigate("/bagtags");
  };

  const handleDiscordClick = () => {
    window.open("https://discord.gg/93CDnK8T3A", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 pt-0 pb-4 min-h-[calc(100vh-300px)] flex flex-col justify-center">
      <img
        src={crdgcLogo}
        alt="CRDGC Logo"
        className="mx-auto h-48 sm:h-32 md:h-48 w-full max-w-[380px] object-contain mt-3 sm:mt-5 md:mt-6 mb-3 sm:mb-5 md:mb-6"
      />
      <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="w-full rounded-3xl border border-[#c1d8cf]/40 bg-[#def0ef]/25 backdrop-blur-xl p-4 sm:p-6 text-center shadow-[0_8px_32px_rgba(15,61,64,0.3)] transition-all duration-300 hover:-translate-y-2 hover:bg-[#def0ef]/35 hover:shadow-[0_12px_48px_rgba(15,61,64,0.4)]">
          <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-[#215356]">
            Klasyfikacja generalna
          </h2>
          <p className="mx-auto max-w-[90%] text-sm sm:text-base text-[#0f3d40] font-medium leading-relaxed">
            Kliknij poniżej, aby zobaczyć wyniki aktualnej klasyfikacji Chain Reaction League
          </p>
          <button
            onClick={handleClick}
            className="mt-4 inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm sm:text-base font-semibold text-[#0f3d40] bg-gradient-to-br from-[#def0ef] via-[#c1d8cf] to-[#95b9b8] shadow-[0_4px_16px_rgba(15,61,64,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,61,64,0.3)]"
          >
            Zobacz wyniki
          </button>
        </div>

        <div className="w-full rounded-3xl border border-[#c1d8cf]/40 bg-[#def0ef]/25 backdrop-blur-xl p-4 sm:p-6 text-center shadow-[0_8px_32px_rgba(15,61,64,0.3)] transition-all duration-300 hover:-translate-y-2 hover:bg-[#def0ef]/35 hover:shadow-[0_12px_48px_rgba(15,61,64,0.4)]">
          <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-[#215356]">
            Chain Reaction Disc Golf Club
          </h2>
          <p className="mx-auto max-w-[90%] text-sm sm:text-base text-[#0f3d40] font-medium leading-relaxed">
            Kliknij poniżej, aby dowiedzieć się więcej o klubie i jak do nas dołączyć!
          </p>
          <button
            onClick={handleDiscordClick}
            className="mt-4 inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm sm:text-base font-semibold text-[#0f3d40] bg-gradient-to-br from-[#def0ef] via-[#c1d8cf] to-[#95b9b8] shadow-[0_4px_16px_rgba(15,61,64,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,61,64,0.3)] hover:text-[#092123]"
          >
            Dołącz do CRDGC
          </button>
        </div>

        <div className="w-full rounded-3xl border border-[#c1d8cf]/40 bg-[#def0ef]/25 backdrop-blur-xl p-4 sm:p-6 text-center shadow-[0_8px_32px_rgba(15,61,64,0.3)] transition-all duration-300 hover:-translate-y-2 hover:bg-[#def0ef]/35 hover:shadow-[0_12px_48px_rgba(15,61,64,0.4)]">
          <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-[#215356]">
            CRDGC BagTag's
          </h2>
          <p className="mx-auto max-w-[90%] text-sm sm:text-base text-[#0f3d40] font-medium leading-relaxed">
            Sprawdź ranking BagTagów na podstawie wyników turnieju DiscGolfMetrix.
          </p>
          <button
            onClick={handleBagTagsClick}
            className="mt-4 inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm sm:text-base font-semibold text-[#0f3d40] bg-gradient-to-br from-[#def0ef] via-[#c1d8cf] to-[#95b9b8] shadow-[0_4px_16px_rgba(15,61,64,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,61,64,0.3)] hover:text-[#092123]"
          >
            Otwórz BagTagi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
