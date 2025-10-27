
import { Header } from './header';
import { Footer } from './footer';

type RootLayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: RootLayoutProps) => {
  return (
    <div className="bg-primary text-gray-900 flex justify-center min-h-screen bg-header">
      <div className="w-[70%] flex flex-col">
          <Header />
          <main className="pt-8">{children}</main>
          <Footer />
      </div>
    </div>
  );
};
