import Image from 'next/image';
import Link from 'next/link';
import headsetReversed from '../public/headset_reversed.svg';

export default function Home() {
  return (
    <main className="h-full">
      <div className="hero min-h-full">
        <div className="hero-content">
          <div className="max-w-md relative">
            <h1 className="text-5xl font-bold mb-5 text-white">
              Connecting Talent. Amplifying Recognition. Shaping Esports.
            </h1>
            <Link
              href="/players"
              className="btn btn-primary rounded-full z-50 cursor-pointer"
            >
              Browser Players
            </Link>
            <Image
              src={headsetReversed}
              alt="Illustration of a headset"
              className="absolute bottom-10 -z-10 left-10 sm:left-20 w-3/4"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
