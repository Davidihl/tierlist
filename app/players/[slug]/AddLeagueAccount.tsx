'use client';

import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const addLeagueAccountMutation = gql`
  mutation AddLeagueAccount($summoner: String!) {
    addLeagueAccount(summoner: $summoner) {
      id
      summoner
      tier
      rank
      leaguePoints
      wins
      losses
    }
  }
`;

export default function AddLeagueAccount() {
  const [summonerName, setSummonerName] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [addLeagueAccountHandler] = useMutation(addLeagueAccountMutation, {
    variables: {
      summoner: summonerName,
    },

    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: () => {
      setOnError('');
      router.refresh();
    },
  });

  return (
    <form className="mt-4 bg-slate-200 p-4 rounded">
      <h2 className="font-medium text-lg">Add League Of Legends Account</h2>
      <label>
        Summoner Name
        <input
          value={summonerName}
          onChange={(event) => {
            setSummonerName(event.currentTarget.value);
          }}
          placeholder="Summoner"
          className="input input-bordered w-full max-w-xs block my-4"
        />
      </label>
      <button
        className="btn btn-secondary rounded-full"
        formAction={async () => {
          setOnError('');
          await addLeagueAccountHandler();
        }}
      >
        Add League Account
      </button>
      {onError.length > 0 ? <p>{onError}</p> : ''}
    </form>
  );
}
