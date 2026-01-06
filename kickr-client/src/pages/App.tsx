import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/layout';
import { ReactQueryProvider } from '../services/queryProvider';
import HomePage from './HomePage';
import { CompetitionsPage } from './CompetitionsPage';
import { CompetitionDetailPage } from './CompetitionDetailPage';
import { TeamDetailPage } from './TeamDetailPage';

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/competitions" element={<CompetitionsPage/>}/>
            <Route path="/competitions/:id" element={<CompetitionDetailPage/>}/>
            <Route path="/teams/:id" element={<TeamDetailPage/>}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
