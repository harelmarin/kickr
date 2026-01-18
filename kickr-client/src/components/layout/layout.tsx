import { Header } from './header';
import { Footer } from './footer';
import { MobileBottomNav } from './mobileBottomNav';
import { useLocation } from 'react-router-dom';

type RootLayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: RootLayoutProps) => {
  const location = useLocation();
  const hideFooterRoutes = ['/register', '/reset-password'];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="bg-kickr-bg-primary min-h-screen flex flex-col pb-20 md:pb-0">
      <Header />
      <div className="flex-1 animate-fade-in">{children}</div>
      {!shouldHideFooter && <Footer />}
      {!shouldHideFooter && <MobileBottomNav />}
    </div>
  );
};
