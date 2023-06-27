import './globals.css';
import { Inter } from 'next/font/google';
import Navigation from '../components/Navigation';
import { ApolloClientProvider } from './ApolloClientProvider';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={`${inter.className}`}>
        <ApolloClientProvider>
          <Navigation />
          {children}
        </ApolloClientProvider>
      </body>
    </html>
  );
}
