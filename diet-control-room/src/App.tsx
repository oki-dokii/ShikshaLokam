import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AgencyEnginePage } from './pages/AgencyEnginePage';
import { ModulesPage } from './pages/ModulesPage';
import { ModuleDetailPage } from './pages/ModuleDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/:clusterId" element={<DashboardPage />} />
        <Route path="/agency" element={<AgencyEnginePage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/modules/:moduleId" element={<ModuleDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
