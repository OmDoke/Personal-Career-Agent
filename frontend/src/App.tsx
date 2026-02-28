import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';

function App() {
  return (
    <Router>
      <div className="antialiased text-slate-900 w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyzer" element={<Analyzer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
