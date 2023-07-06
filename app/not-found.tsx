import Link from 'next/link';

export const rootNotFoundMetadata = {
  title: 'Not Found',
  description: "sorry can't find the page you are looking for",
};

export default function RootNotFound() {
  return (
    <main className="flex flex-col items-center sm:p-4 gap-4 sm:h-full sm:justify-center">
      <div className="shadow-xl w-full max-w-4xl bg-base-100 border-primary sm:border-t-4">
        <div className="card-body">
          <h1 className="my-2 text-gray-800 font-bold text-2xl">
            Looks like you've found the doorway to the great nothing
          </h1>
          <p className="my-2 text-gray-800">
            Sorry about that! Please visit our hompage to get where you need to
            go.
          </p>
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
