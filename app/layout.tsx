import './globals.css';
import Link from 'next/link';
import { ApolloClientProvider } from './ApolloClientProvider';
import Navigation from './Navigation';

export const metadata = {
  title: {
    default: 'ESVÖ Playerdatabase',
    template: '%s | ESVÖ Playerdatabase',
  },
  description: 'Elevating players and organisations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col justify-between relative pt-[64px] bg-slate-400">
        <ApolloClientProvider>
          <Navigation />
          {children}
        </ApolloClientProvider>
        <footer className="text-base-content">
          <div className="p-4">
            <p className="flex flex-wrap gap-4 w-full justify-center">
              <span className="border-r pr-4 border-black">
                Copyright © 2023 - David Ihl
              </span>
              <Link href="https://github.com/Davidihl">Github</Link>
              <Link href="https://www.linkedin.com/in/david-ihl/">
                LinkedIn
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
