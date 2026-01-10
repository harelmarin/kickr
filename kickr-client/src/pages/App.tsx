import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { Layout } from '../components/Layout/layout';
import { ReactQueryProvider } from '../services/queryProvider';
import { ScrollToTop } from '../components/ScrollToTop';
import { useAuth } from '../hooks/useAuth';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Lazy loading components
const HomePage = lazy(() => import('./HomePage'));
const RegisterPage = lazy(() => import('./RegisterPage').then(module => ({ default: module.RegisterPage })));
const CommunityPage = lazy(() => import('./CommunityPage').then(module => ({ default: module.CommunityPage })));
const CompetitionsPage = lazy(() => import('./CompetitionsPage').then(module => ({ default: module.CompetitionsPage })));
const CompetitionDetailPage = lazy(() => import('./CompetitionDetailPage').then(module => ({ default: module.CompetitionDetailPage })));
const TeamsPage = lazy(() => import('./TeamsPage').then(module => ({ default: module.TeamsPage })));
const TeamDetailPage = lazy(() => import('./TeamDetailPage').then(module => ({ default: module.TeamDetailPage })));
const MatchesPage = lazy(() => import('./MatchesPage').then(module => ({ default: module.MatchesPage })));
const MatchDetailPage = lazy(() => import('./MatchDetailPage').then(module => ({ default: module.MatchDetailPage })));
const UserDetailPage = lazy(() => import('./UserDetailPage').then(module => ({ default: module.UserDetailPage })));
const UserMatchesPage = lazy(() => import('./UserMatchesPage').then(module => ({ default: module.UserMatchesPage })));
const UserDiaryPage = lazy(() => import('./UserDiaryPage').then(module => ({ default: module.UserDiaryPage })));
const ReviewDetailPage = lazy(() => import('./ReviewDetailPage').then(module => ({ default: module.ReviewDetailPage })));
const AdminPage = lazy(() => import('./AdminPage'));
const SettingsPage = lazy(() => import('./SettingsPage').then(module => ({ default: module.SettingsPage })));
const NotFoundPage = lazy(() => import('./NotFoundPage').then(module => ({ default: module.NotFoundPage })));

const PageLoader = () => (
  <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      <div className="w-12 h-12 border-2 border-kickr/10 border-t-kickr rounded-full animate-spin"></div>
      <p className="text-kickr font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Establishing Connection</p>
    </div>
  </div>
);

function App() {
  const { checkAuth, user } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <ReactQueryProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/competitions" element={<CompetitionsPage />} />
                <Route path="/competitions/:id" element={<CompetitionDetailPage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/teams/:id" element={<TeamDetailPage />} />
                <Route path="/matches" element={<MatchesPage />} />
                <Route path="/matches/:id" element={<MatchDetailPage />} />
                <Route path="/user/:id" element={<UserDetailPage />} />
                <Route path="/user/:id/matches" element={<UserMatchesPage />} />
                <Route path="/user/:id/diary" element={<UserDiaryPage />} />
                <Route path="/reviews/:id" element={<ReviewDetailPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={user ? <Navigate to={`/user/${user.id}`} replace /> : <Navigate to="/" replace />}
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </ReactQueryProvider>
    </ErrorBoundary>
  );
}

export default App;
