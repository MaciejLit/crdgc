import { Link, useLocation } from "react-router-dom";
import crdgcLogo from "../assets/crdgcLogo.png";
import chainLeague from "../assets/chain-LEAGUE.png";

const Header: React.FC = () => {
  const location = useLocation();
  const logoToDisplay = location.pathname === "/classification" ? chainLeague : crdgcLogo;
  const logoClass =
    location.pathname === "/classification"
      ? "h-40 sm:h-52 md:h-64 mt-2 sm:mt-4 md:mt-8"
      : "h-40 sm:h-52 md:h-64 mt-4 sm:mt-8 md:mt-14 mb-4 sm:mb-5 md:mb-6";

  return (
    <header className="relative w-full">
      <nav className="fixed top-0 left-0 z-50 w-full flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-3 sm:px-6 py-2 text-[#fefefe] border-b border-[#c1d8cf]/30 bg-[#0f3d40]/25 backdrop-blur">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm sm:text-base border border-transparent hover:border-[#c1d8cf]/40 hover:bg-[#c1d8cf]/20 transition-colors"
        >
          <img src={crdgcLogo} alt="CRDGC Logo" className="h-9 sm:h-11" />
        </Link>
        <Link
          to="/classification"
          className="rounded-lg px-3 py-2 text-sm sm:text-base border border-transparent hover:border-[#c1d8cf]/40 hover:bg-[#c1d8cf]/20 transition-colors"
        >
          Tabela wyników
        </Link>
      </nav>
      <img
        src={logoToDisplay}
        alt="CRDGC Logo"
        className={`mx-auto w-full max-w-[500px] object-contain ${logoClass}`}
      />
    </header>
  );
};

export default Header;
