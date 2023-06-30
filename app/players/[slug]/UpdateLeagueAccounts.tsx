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
  const [rotating, setRotating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showNotification]);

  const [updateLeagueAccountsHandler] = useMutation(updateLeagueAccounts, {
    variables: { playerId: props.playerId },

    onError: (error) => {
      setShowNotification(true);
      setRotating(false);
      setOnError(error.message);
    },

    onCompleted: () => {
      setOnError('');
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
    </form>
  );
}
