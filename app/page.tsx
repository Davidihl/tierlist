import Image from 'next/image';
import { getLeagueofLegendsData } from '../util/leagueoflegends';
import styles from './page.module.css';

export default async function Home() {
  const test = await getLeagueofLegendsData('Chaoslordi');
  console.log(test);
  return (
    <main className={styles.main}>
      <div>Hello World</div>
    </main>
  );
}
