import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/layout';
import { ReactQueryProvider } from '../services/queryProvider';
import HomePage from './HomePage';

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
