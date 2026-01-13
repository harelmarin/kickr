import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { Layout } from '../components/layout/layout';
import { ReactQueryProvider } from '../services/queryprovider';
import { ScrollToTop } from '../components/scrolltotop';
import { useAuth } from '../hooks/useauth';
import { ErrorBoundary } from '../components/ui/errorboundary';
import { ProtectedRoute } from '../components/auth/protectedroute';
import logo from '../assets/logo.png';

// Lazy loading components
const HomePage = lazy(() => import('./homepage'));
const RegisterPage = lazy(() => import('./registerpage').then(module => ({ default: module.RegisterPage })));
const CommunityPage = lazy(() => import('./communitypage').then(module => ({ default: module.CommunityPage })));
const CompetitionsPage = lazy(() => import('./competitionspage').then(module => ({ default: module.CompetitionsPage })));
const CompetitionDetailPage = lazy(() => import('./competitiondetailpage').then(module => ({ default: module.CompetitionDetailPage })));
const TeamsPage = lazy(() => import('./teamspage').then(module => ({ default: module.TeamsPage })));
const TeamDetailPage = lazy(() => import('./teamdetailpage').then(module => ({ default: module.TeamDetailPage })));
const MatchesPage = lazy(() => import('./matchespage').then(module => ({ default: module.MatchesPage })));
const MatchDetailPage = lazy(() => import('./matchdetailpage').then(module => ({ default: module.MatchDetailPage })));
const UserDetailPage = lazy(() => import('./userdetailpage').then(module => ({ default: module.UserDetailPage })));
const UserMatchesPage = lazy(() => import('./usermatchespage').then(module => ({ default: module.UserMatchesPage })));
const UserDiaryPage = lazy(() => import('./userdiarypage').then(module => ({ default: module.UserDiaryPage })));
const ReviewDetailPage = lazy(() => import('./reviewdetailpage').then(module => ({ default: module.ReviewDetailPage })));
const AdminPage = lazy(() => import('./adminpage'));
const SettingsPage = lazy(() => import('./settingspage').then(module => ({ default: module.SettingsPage })));
const ResetPasswordPage = lazy(() => import('./resetpasswordpage').then(module => ({ default: module.ResetPasswordPage })));
const UserNetworkPage = lazy(() => import('./usernetworkpage').then(module => ({ default: module.UserNetworkPage })));
const FriendsFeedPage = lazy(() => import('./friendsfeedpage').then(module => ({ default: module.FriendsFeedPage })));
const NotFoundPage = lazy(() => import('./notfoundpage').then(module => ({ default: module.NotFoundPage })));
const AboutPage = lazy(() => import('./aboutpage').then(module => ({ default: module.AboutPage })));
const TermsPage = lazy(() => import('./termspage').then(module => ({ default: module.TermsPage })));

const PageLoader = () => (
  <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <div className="absolute inset-0 bg-kickr/20 blur-2xl rounded-full animate-pulse"></div>
        <img
          src={logo}
          alt="Kickr Logo"
          className="w-16 h-16 object-contain relative z-10 mix-blend-screen brightness-125 animate-bounce"
        />
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-kickr animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
        <p className="text-kickr font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Establishing Connection</p>
      </div>
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
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/feed" element={
                  <ProtectedRoute>
                    <FriendsFeedPage />
                  </ProtectedRoute>
                } />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/competitions" element={<CompetitionsPage />} />
                <Route path="/competitions/:id" element={<CompetitionDetailPage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/teams/:id" element={<TeamDetailPage />} />
                <Route path="/matches" element={<MatchesPage />} />
                <Route path="/matches/:id" element={<MatchDetailPage />} />
                <Route path="/user/:id" element={<UserDetailPage />} />
                <Route path="/user/:id/matches" element={<UserMatchesPage />} />
                <Route path="/user/:id/diary" element={<UserDiaryPage />} />
                <Route path="/user/:id/followers" element={<UserNetworkPage type="followers" />} />
                <Route path="/user/:id/following" element={<UserNetworkPage type="following" />} />
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
