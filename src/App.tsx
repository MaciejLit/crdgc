import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Classification from "./pages/Classification";
import BagTags from "./pages/BagTags";
import ComingSoon from "./pages/ComingSoon";

const App: React.FC = () => {
  return (
    <Router>
      <div className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classification" element={<Classification />} />
          <Route path="/bagtags" element={<BagTags />} />
          <Route path="/team" element={<ComingSoon title="Nasz zespół" />} />
          <Route path="/courses" element={<ComingSoon title="Nasze pola" />} />
          <Route path="/tournaments" element={<ComingSoon title="Nasze turnieje" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
