import { debug } from 'console';
import Image from 'next/image';
import { LeagueofLegends } from '../database/leagueoflegends';
import { getPlayerById } from '../database/players';
import esvoeLogo from '../public/esvoe_Logo.svg';
import { getLeagueofLegendsData } from './api/leagueoflegends';
import styles from './page.module.css';

export default async function Home() {
  // DEBUG RIOT API
  // const debugRiotObject = await getLeagueofLegendsData('AFW Nan0');
  const debugRiotObject: LeagueofLegends = await getLeagueofLegendsData(
    'Chaoslordi',
  );
  // console.log('result', debugRiotObject);

  return (
    <main className={styles.main}>
      <div className="flex gap-4 items-center">
        <Image src={esvoeLogo} className="w-48" alt="ESVÖ Logo" />
        <h1 className="text-3xl font-medium ">Player Database</h1>
      </div>
      <section className="flex flex-col gap-4 mt-8 flex-shrink-0">
        <h2 className="text-2xl pt-3">DEBUG</h2>
        <div className="p-3 rounded bg-gray-300 drop-shadow-xl max-w-xs border-gray-700 flex flex-col items-center gap-1">
          <h3>RIOT API</h3>
          <div>
            <Image
              src={`/leagueoflegends/tiers/${debugRiotObject.tier}.webp`}
              alt={debugRiotObject.tier}
              width={150}
              height={150}
            />
          </div>
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
