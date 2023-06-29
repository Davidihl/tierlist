'use client';
import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  id: number;
};

const endAssociation = gql`
  mutation EndAssociation($endAssociationId: ID!) {
    endAssociation(id: $endAssociationId) {
      id
    }
  }
`;

export default function DenyAssociation(props: Props) {
  const [onError, setOnError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showNotification]);

  const [endAssociationHandler] = useMutation(endAssociation, {
    variables: { endAssociationId: props.id },

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
        className="btn btn-sm rounded-full"
        onClick={async () => {
          setOnError('');
          await endAssociationHandler();
        }}
      >
        Deny
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
