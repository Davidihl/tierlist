'use client';
import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import markMainIcon from '../../../public/markmain.svg';

type Props = {
  leagueAccountId: number;
  playerId: number;
};

const setMainAccountMutation = gql`
  mutation SetMainAccount($leagueAccountId: Int!, $playerId: Int!) {
    setMainAccount(leagueAccountId: $leagueAccountId, playerId: $playerId) {
      id
    }
  }
`;

export default function SetMainAccount(props: Props) {
  const [onError, setOnError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showNotification]);

  const [setMainAccountHandler] = useMutation(setMainAccountMutation, {
    variables: {
      leagueAccountId: Number(props.leagueAccountId),
      playerId: Number(props.playerId),
    },

    onError: (error) => {
      setShowNotification(true);
      setOnError(error.message);
    },

    onCompleted: () => {
      setOnError('');
      router.refresh();
    },
  });

  return (
    <>
      <button
        className="btn btn-circle mr-2"
        onClick={async () => {
          setOnError('');
          await setMainAccountHandler();
        }}
      >
        <Image src={markMainIcon} alt="Mark Main Account Icon" />
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
    </>
  );
}
