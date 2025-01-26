import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Classification from "./pages/Classification";

const App: React.FC = () => {
  return (
    <Router>
      <div className="main">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/classification" element={<Classification />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
