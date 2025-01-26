import { Link, useLocation } from "react-router-dom";
import crdgcLogo from '../assets/crdgcLogo.png';
import chainLeague from '../assets/chain-LEAGUE.png';
import { Box } from "@mui/material";

const Header: React.FC = () => {
  const location = useLocation();
  const logoToDisplay = location.pathname === '/classification' ? chainLeague : crdgcLogo;
  const classDependsOfLogo = location.pathname === '/classification' ? {height: 250, marginTop: 8} : {height: 250, marginTop: 14, marginBottom: 6};
  return (
    <header className="relative w-full">
      <nav className="fixed top-0 left-0 w-full border-b-2 flex justify-center gap-8 p-2 text-white font-poppins font-normal text-lg z-50 backdrop-blur-md backdrop-brightness-75 items-center">
        <Link 
          to="/" 
          className="px-4 py-2 rounded text-white hover:underline hover:text-white hover:bg-black hover:bg-opacity-75 transition-colors duration-300"
        >
          <Box
            component="img"
            sx={{
              height: 40,
            }}
            src={crdgcLogo}
            alt="CRDGC Logo"
            className="mx-auto"
          /> 
        </Link>
        <Link 
          to="/classification" 
          className="px-4 py-2 rounded text-white hover:underline hover:text-white hover:bg-black hover:bg-opacity-75 transition-colors duration-300"
        >
          Tabela wyników
        </Link>
      </nav>
      <Box
        component="img"
        sx={classDependsOfLogo}
        src={logoToDisplay}
        alt="CRDGC Logo"
        className="mx-auto"
      />
    </header>
  );
};

export default Header;
