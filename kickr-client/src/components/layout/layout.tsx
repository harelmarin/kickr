
import { Header } from './header';
import { Footer } from './footer';

type RootLayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: RootLayoutProps) => {
  return (
    <div className="bg-[#14181c] min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 animate-fade-in">{children}</div>
      <Footer />
    </div>
  );
};
