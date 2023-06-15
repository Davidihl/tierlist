import Image from 'next/image';
import { getLeagueofLegendsData } from './api/leagueoflegends';
import styles from './page.module.css';

export default async function Home() {
  const test = await getLeagueofLegendsData('Chaoslordi');
  return (
    <main className={styles.main}>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </main>
  );
}
