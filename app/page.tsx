import Image from 'next/image';
import Link from 'next/link';
import headset from '../public/headset.svg';
import mouse from '../public/mouse.svg';

export default function Home() {
  return (
    <main className="h-full relative">
      <div className="hero min-h-full">
        <div className="hero-content flex-col">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-5 text-white">
              Connecting Talent. Amplifying Recognition. Shaping Esports.
            </h1>
            <Link href="/players" className="btn btn-primary rounded-full z-50">
              Browser Players
            </Link>
            <div className="mt-24 bg-base-100 shadow-lg p-4 border-t-4 border-primary max-w-md">
              <h2 className="font-medium text-xl mb-2">About This Project</h2>
              <p>
                This application is a prototype allowing users to sign up as
                either organizations or players. Players can showcase their
                League of Legends accounts and display their respective
                strengths while organisations can facilitate associations to the
                players.
              </p>
            </div>
          </div>
          <Image
            src={headset}
            alt="Illustration of a headset"
            className="absolute right-0 bottom-1/4 -z-10 w-1/2 max-w-sm"
          />
        </div>
      </div>
    </main>
  );
}
