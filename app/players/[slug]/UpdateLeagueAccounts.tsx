'use client';
import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import acceptIcon from '../../../public/accept.svg';
import updateIcon from '../../../public/update.svg';

type Props = {
  playerId: number;
};

const updateLeagueAccounts = gql`
  mutation Mutation($playerId: ID!) {
    updateLeagueAccounts(playerId: $playerId) {
      id
    }
  }
`;

export default function UpdateLeagueAccounts(props: Props) {
  const [onError, setOnError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showNotification]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [done]);

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
      setDone(true);
      router.refresh();
    },
  });

  return (
    <>
      <button
        className="flex items-center btn rounded-full group transition-all"
        onClick={async () => {
          setRotating(true);
          setOnError('');
          await updateLeagueAccountsHandler();
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
      {done ? (
        <div className="toast toast-bottom toast-center">
          <div className="alert alert-success">
            <span>Updated all League of Legends accounts</span>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
