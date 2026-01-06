import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from '../components/Layout/layout';
import { ReactQueryProvider } from '../services/queryProvider';
import { ScrollToTop } from '../components/ScrollToTop';
import { useAuth } from '../hooks/useAuth';
import HomePage from './HomePage';
import { CompetitionsPage } from './CompetitionsPage';
import { CompetitionDetailPage } from './CompetitionDetailPage';
import { TeamDetailPage } from './TeamDetailPage';
import { TeamsPage } from './TeamsPage';
import { MatchDetailPage } from './MatchDetailPage';
import { MatchesPage } from './MatchesPage';

function App() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/competitions" element={<CompetitionsPage />} />
            <Route path="/competitions/:id" element={<CompetitionDetailPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:id" element={<TeamDetailPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/matches/:id" element={<MatchDetailPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
