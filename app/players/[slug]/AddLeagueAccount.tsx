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
        className="btn btn-secondary rounded-full"
        formAction={async () => {
          setOnError('');
          const riotResponse = await searchLeagueAccount(summonerName);
          if ('error' in riotResponse) {
            return setOnError(riotResponse.error);
          }

          console.log(riotResponse);
          // call add League of Legends mutation --- probably rework the whole formAction (see create user)
        }}
      >
        Search Account
      </button>
      {onError.length > 0 ? <p>{onError}</p> : ''}
    </form>
  );
}
