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
  const [showSuccess, setShowSuccess] = useState(false);
  const [onError, setOnError] = useState('');
  const [graphQlError, setGraphQlError] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showNotification]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const [addLeagueAccountHandler] = useMutation(addLeagueAccountMutation, {
    variables: {
      summoner: summonerName,
    },

    onError: (error) => {
      setOnError(error.message);
      const errorCode: any = error.graphQLErrors[0]?.extensions.code;
      setGraphQlError(errorCode);
      setShowNotification(true);
      setUpdateStatus('');
    },

    onCompleted: () => {
      setOnError('');
      setUpdateStatus('');
      setShowSuccess(true);
      console.log(updateStatus);
      router.refresh();
    },
  });

  return (
    <div className="w-full max-w-4xl">
      <form className="shadow-xl w-full max-w-2xl bg-base-100 border-accent sm:border-t-4">
        <div className="card-body">
          <h2 className="font-medium text-lg mb-2">
            Add League Of Legends Account
          </h2>
          <label className="label-text">
            Summoner Name
            <input
              value={summonerName}
              onChange={(event) => {
                setSummonerName(event.currentTarget.value);
              }}
              placeholder="Summoner"
              className={`mt-1 p-2 block input input-bordered w-full${
                graphQlError === '40004' ? 'input-error' : ''
              } ${graphQlError === '40006' ? 'input-error' : ''}`}
            />
          </label>
          <div>
            <button
              className="btn btn-secondary rounded-full"
              formAction={async () => {
                setOnError('');
                setUpdateStatus('Searching');
                console.log(updateStatus);
                await addLeagueAccountHandler();
                setSummonerName('');
                router.refresh();
              }}
            >
              Add League Account
            </button>
            <span className="text-xs ml-4">{updateStatus}</span>
          </div>
          {showNotification ? (
            <div className="toast toast-center ">
              <div className="alert alert-error">
                <span>{onError}</span>
              </div>
            </div>
          ) : (
            ''
          )}
          {showSuccess ? (
            <div className="toast toast-center ">
              <div className="alert alert-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Summoner found. List will be updated.</span>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </form>
    </div>
  );
}
