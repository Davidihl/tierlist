import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import Link from 'next/link';

export default function Home() {
  if (process.env.NODE_ENV !== 'production') {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
  }

  return (
    <main className="h-full">
      <div className="hero min-h-full">
        <div className="hero-content">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-5">
              Connecting Talent. Amplifying Recognition. Shaping Esports.
            </h1>
            <Link href="/players" className="btn btn-primary rounded-full">
              Browser Players
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
