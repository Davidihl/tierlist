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
  const [result, setResult] = useState({});
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
          const riotResponse = await searchLeagueAccount(summonerName);
          if ('error' in riotResponse) {
            return setOnError(riotResponse.error);
          }
          setResult(riotResponse);
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
