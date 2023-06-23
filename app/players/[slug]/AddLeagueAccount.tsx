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
          await addLeagueAccountHandler();
        }}
      >
        Add League Account
      </button>
      {onError.length > 0 ? <p>{onError}</p> : ''}
    </form>
  );
}
