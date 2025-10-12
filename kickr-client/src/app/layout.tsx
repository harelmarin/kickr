import './globals.css';
import { ReactNode } from 'react';
import { ReactQueryProvider } from '@/services/queryProvider';
import { Header } from '@/components/Layout/header';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-primary xt-gray-900 flex justify-center bg-header">
        <div className="w-[70%]" >
        <ReactQueryProvider>
          <Header />
          <main className="pt-8">{children}</main>
        </ReactQueryProvider>
        </div>
      </body>
    </html>
  );
}
