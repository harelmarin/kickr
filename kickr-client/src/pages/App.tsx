import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/layout';
import { ReactQueryProvider } from '../services/queryProvider';
import HomePage from './HomePage';
import { CompetitionsPage } from './CompetitionsPage';

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/competitions" element={<CompetitionsPage/>}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
