import Link from 'next/link';

export const metadata = {
  title: 'Players',
  description: 'Explore players registered in the ESVÖ playerdatabase',
};

export default function PlayersPage() {
  return (
    <main>
      <h1>Players</h1>
      <Link href="/players/chaoslordi">Demo User</Link>
    </main>
  );
}
