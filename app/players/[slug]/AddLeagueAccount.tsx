'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { searchLeagueAccount } from './actions';

type Props = {
  userId: number;
};

export default function AddLeagueAccount(props: Props) {
  const [summonerName, setSummonerName] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();

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
          setOnError('');
          const result = await searchLeagueAccount(summonerName);
          if ('error' in result) {
            return setOnError(result.error);
          }
          setSummonerName('');
          console.log(result);
          router.refresh();
        }}
      >
        Search
      </button>
      {onError.length > 0 ? <p>{onError}</p> : ''}
    </form>
  );
}
