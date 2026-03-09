import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Enhancer from './pages/Enhancer';
import { Footer } from './components/layout/Footer';

function App() {
  return (
    <Router>
      <div className="antialiased text-slate-900 w-full min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/enhancer" element={<Enhancer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
