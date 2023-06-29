'use client';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  id: number;
  playerId: number;
};

const acceptAssociation = gql`
  mutation acceptAssociation(
    $acceptAssociationByPlayerId: ID!
    $playerId: Int!
  ) {
    acceptAssociationByPlayer(
      id: $acceptAssociationByPlayerId
      playerId: $playerId
    ) {
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

  const [acceptAssociationHandler] = useMutation(acceptAssociation, {
    variables: {
      acceptAssociationByPlayerId: props.id,
      playerId: props.playerId,
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
        className="btn btn-sm btn-primary rounded-full"
        onClick={async () => {
          setOnError('');
          await acceptAssociationHandler();
        }}
      >
        Accept
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
