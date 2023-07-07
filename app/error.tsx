'use client'; // Error components must be Client Components

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col items-center sm:p-4 gap-4">
      <div className="shadow-xl w-full max-w-4xl bg-base-100 border-primary sm:border-t-4">
        <div className="card-body">
          <h1 className="font-medium text-xl">
            It's not your fault. It's mine!
          </h1>
          <p>Sometimes, something goes wrong. Sorry for that!</p>
          <div>
            <Link href="/" className="btn btn-primary rounded-full">
              Take me home!
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
