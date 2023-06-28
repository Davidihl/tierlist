import './globals.css';
import Navigation from '../components/Navigation';
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
      <body>
        <ApolloClientProvider>
          <Navigation />
          {children}
        </ApolloClientProvider>
      </body>
    </html>
  );
}
