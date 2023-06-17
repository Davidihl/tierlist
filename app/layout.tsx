import './globals.css';
import { gql } from '@apollo/client';
import { Inter } from 'next/font/google';
import Navigation from '../components/navigation';
import { getClient } from '../util/apolloClient';
import { ApolloClientProvider } from './ApolloClientProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloClientProvider>
          <Navigation />
          {children}
        </ApolloClientProvider>
      </body>
    </html>
  );
}
