'use client';
import { usePathname } from 'next/navigation';
import MainLayout from './components/Navigation/MainLayout';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Pages that should NOT use MainLayout (no bottom nav, no extra padding)
  const noLayoutPages = ['/', '/auth', '/publicprofile'];
  const useMainLayout = !noLayoutPages.includes(pathname);
  
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body className={inter.className}>
        {useMainLayout ? (
          <MainLayout>
            {children}
          </MainLayout>
        ) : (
          <div className="auth-page-container">
            {children}
          </div>
        )}
      </body>
    </html>
  );
}