import './globals.css';
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
      </body>
    </html>
  );
}
