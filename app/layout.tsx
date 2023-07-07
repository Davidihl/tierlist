import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import background from '../public/background.svg';
import { ApolloClientProvider } from './ApolloClientProvider';

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
        <footer className="footer footer-center p-4 relative text-base-content">
          <div className="mb-10">
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
          <Image
            src={background}
            className="absolute bottom-0 w-full -z-10"
            alt="Red shapes"
          />
        </footer>
      </body>
    </html>
  );
}
