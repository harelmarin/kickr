import { ReactNode } from 'react';
import { ReactQueryProvider } from '../components/queryProvider';
import './globals.css';


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
