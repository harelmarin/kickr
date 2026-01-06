
import { Header } from './header';
import { Footer } from './footer';

type RootLayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: RootLayoutProps) => {
  return (
    <div className="bg-primary min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
