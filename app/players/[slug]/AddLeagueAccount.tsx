'use client';

import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const [showNotification, setShowNotification] = useState(false);
  const [onError, setOnError] = useState('');
  const [graphQlError, setGraphQlError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showNotification]);

  const [addLeagueAccountHandler] = useMutation(addLeagueAccountMutation, {
    variables: {
      summoner: summonerName,
    },

    onError: (error) => {
      setOnError(error.message);
      const errorCode: any = error.graphQLErrors[0]?.extensions.code;
      setGraphQlError(errorCode);
      setShowNotification(true);
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
          className={`input input-bordered w-full max-w-xs block my-4 ${
            graphQlError === '40004' ? 'input-error' : ''
          } ${graphQlError === '40006' ? 'input-error' : ''}`}
        />
      </label>
      <button
        className="btn btn-secondary rounded-full"
        formAction={async () => {
          setOnError('');
          await addLeagueAccountHandler();
          setSummonerName('');
        }}
      >
        Add League Account
      </button>
      {showNotification ? (
        <div className="toast toast-center ">
          <div className="alert alert-error">
            <span>{onError}</span>
          </div>
        </div>
      ) : (
        ''
      )}
    </form>
  );
}
