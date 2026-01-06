import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/layout';
import { ReactQueryProvider } from '../services/queryProvider';
import HomePage from './HomePage';
import { CompetitionsPage } from './CompetitionsPage';
import { CompetitionDetailPage } from './CompetitionDetailPage';

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/competitions" element={<CompetitionsPage/>}/>
            <Route path="/competitions/:id" element={<CompetitionDetailPage/>}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
