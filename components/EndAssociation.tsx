'use client';
import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import removeIcon from '../public/remove.svg';

type Props = {
  something: string;
};

// const endAssociation = gql``;

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

  // const [endAssociationHandler] = useMutation(endAssociation, {
  //   variables: {},

  //   onError: (error) => {
  //     setShowNotification(true);
  //     setOnError(error.message);
  //   },

  //   onCompleted: () => {
  //     setOnError('');
  //     router.refresh();
  //   },
  // });

  return (
    <>
      <button
        className="btn btn-circle mr-2"
        onClick={() => {
          setOnError('');
          console.log('click');
        }}
      >
        <Image src={removeIcon} alt="Delete Icon" />
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
