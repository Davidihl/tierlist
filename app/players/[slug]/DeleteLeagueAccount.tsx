'use client';
import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import deleteIcon from '../../../public/delete.svg';

type Props = {
  leagueAccountId: number;
};

const deleteLeagueAccountMutation = gql`
  mutation DeleteLeagueAccount($deleteLeagueAccountId: Int!) {
    deleteLeagueAccount(id: $deleteLeagueAccountId) {
      id
    }
  }
`;

export default function DeleteLeagueAccount(props: Props) {
  const [onError, setOnError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showNotification]);

  const [deleteLeagueAccountHandler] = useMutation(
    deleteLeagueAccountMutation,
    {
      variables: {
        deleteLeagueAccountId: Number(props.leagueAccountId),
      },

      onError: (error) => {
        setShowNotification(true);
        setOnError(error.message);
      },

      onCompleted: () => {
        setOnError('');
        router.refresh();
      },
    },
  );

  return (
    <>
      <button
        className="btn btn-circle mr-2"
        onClick={async () => {
          setOnError('');
          await deleteLeagueAccountHandler();
        }}
      >
        <Image src={deleteIcon} alt="Delete Icon" />
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
