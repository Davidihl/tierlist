import Image from 'next/image';
import queryString from 'query-string';
import { callSummonerApi, getLeagueofLegendsData } from './api/leagueoflegends';
import styles from './page.module.css';

export default async function Home() {
  // const test = await getLeagueofLegendsData('Chaoslordi');
  // console.log('result', test);

  const test2 = await getLeagueofLegendsData('Chaoslordi');
  console.log('result', test2);

  // const test3 = await getLeagueofLegendsData('AFW Nan0');
  // console.log('result', test3);

  return (
    <main className={styles.main}>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </main>
  );
}
