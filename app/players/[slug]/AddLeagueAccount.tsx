'use client';

import { useState } from 'react';

type Props = {
  userId: number;
};

export default async function AddLeagueAccount(props: Props) {
  const [summonerName, setSummonerName] = useState('');
  return (
    <form>
      <h2>Add League Of Legends Account</h2>
      <label>
        Summoner Name
        <input
          value={summonerName}
          onChange={(event) => setSummonerName(event.currentTarget.value)}
          placeholder="Summoner"
          className="p-2 block"
        />
      </label>
    </form>
  );
}
