'use client';
import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import updateIcon from '../../../public/update.svg';

type Props = {
  playerId: number;
};

const updateLeagueAccounts = gql`
  mutation Mutation($playerId: ID!) {
    updateLeagueAccounts(playerId: $playerId) {
      id
      tier
      rank
      leaguePoints
      summoner
      wins
      losses
      lastUpdate
    }
  }
`;

export default function UpdateLeagueAccounts(props: Props) {
  const [onError, setOnError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rotating, setRotating] = useState(false);
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

  const [updateLeagueAccountsHandler] = useMutation(updateLeagueAccounts, {
    variables: { playerId: props.playerId },

    onError: (error) => {
      setShowNotification(true);
      setRotating(false);
      setOnError(error.message);
    },

    onCompleted: () => {
      setOnError('');
      setShowSuccess(true);
      setRotating(false);
    },
  });

  return (
    <form>
      <button
        className="flex items-center btn rounded-full group transition-all"
        formAction={async () => {
          setRotating(true);
          setOnError('');
          await updateLeagueAccountsHandler();
          router.refresh();
        }}
      >
        <Image
          src={updateIcon}
          alt="Update Icon"
          className={rotating ? 'animate-reverse-spin' : ''}
        />
        Update Riot Data
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
            <span>Update complete. List will refresh now.</span>
          </div>
        </div>
      ) : (
        ''
      )}
    </form>
  );
}
