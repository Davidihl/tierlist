import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import background from '../public/background.svg';
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
      <body className="h-screen relative pt-[64px] bg-slate-400">
        <ApolloClientProvider>
          <Navigation />
          {children}
        </ApolloClientProvider>
        <footer className="footer footer-center text-base-content p-4">
          <div>
            <p className="flex flex-wrap gap-4 justify-">
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
