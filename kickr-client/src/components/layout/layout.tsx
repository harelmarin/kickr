import { Header } from './header';
import { Footer } from './footer';
import { useLocation } from 'react-router-dom';

type RootLayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: RootLayoutProps) => {
  const location = useLocation();
  const hideFooterRoutes = ['/register'];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="bg-[#14181c] min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 animate-fade-in">{children}</div>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};
