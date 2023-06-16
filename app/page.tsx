import { debug } from 'console';
import Image from 'next/image';
import {
  callSummonerApi,
  getLeagueofLegendsData,
  LeagueofLegends,
} from './api/leagueoflegends';
import styles from './page.module.css';

export default async function Home() {
  // DEBUG RIOT API
  // const debugRiotObject = await getLeagueofLegendsData('AFW Nan0');
  const debugRiotObject: LeagueofLegends = await getLeagueofLegendsData(
    'Chaoslordi',
  );
  console.log('result', debugRiotObject);

  return (
    <main className={styles.main}>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <section className="flex flex-col gap-4">
        <h2 className="pt-3">DEV-Section</h2>
        <div>
          <h3 className="pt-3">RIOT API DEBUG</h3>
          <div>Account: {debugRiotObject.summoner}</div>
          <div>Tier: {debugRiotObject.tier}</div>
          <div>Rank: {debugRiotObject.rank}</div>
          <div>LeaguePoints: {debugRiotObject.leaguePoints}</div>
          <div>Wins: {debugRiotObject.wins}</div>
          <div>Losses: {debugRiotObject.losses}</div>
        </div>
        <div>
          <h3>Components</h3>
          <div>Placeholder</div>
        </div>
      </section>
    </main>
  );
}
