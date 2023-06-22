'use client';

import { useState } from 'react';
import { searchLeagueAccount } from './actions';

type Props = {
  userId: number;
};

export default function AddLeagueAccount(props: Props) {
  const [summonerName, setSummonerName] = useState('');

  console.log(props.userId);

  return (
    <form>
      <h2>Add League Of Legends Account</h2>
      <label>
        Summoner Name
        <input
          value={summonerName}
          onChange={(event) => {
            setSummonerName(event.currentTarget.value);
          }}
          placeholder="Summoner"
          className="p-2 block"
        />
      </label>
      <button
        className="btn"
        formAction={async () => {
          const result = await searchLeagueAccount(summonerName);
          console.log(result);
        }}
      >
        Search
      </button>
    </form>
  );
}
