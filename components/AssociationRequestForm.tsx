'use client';

import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  isPlayer: boolean;
  userId: number;
};

const requestAssociationByOrganisation = gql`
  mutation RequestAssociationByOrganisation(
    $userId: Int!
    $playerAlias: String!
    $playerRequest: Boolean!
  ) {
    requestAssociationByOrganisation(
      userId: $userId
      playerAlias: $playerAlias
      playerRequest: $playerRequest
    ) {
      id
    }
  }
`;

export default function AssociationRequestForm(props: Props) {
  const [alias, setAlias] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [onError, setOnError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showNotification]);

  const [requestAssociationByOrganisationHandler]: any = useMutation(
    requestAssociationByOrganisation,
    {
      variables: {
        userId: Number(props.userId),
        playerAlias: alias,
        playerRequest: false,
      },

      onError: (error) => {
        setOnError(error.message);
        setShowNotification(true);
      },

      onCompleted: () => {
        setOnError('');
        setAlias('');
        router.refresh();
      },
    },
  );

  return (
    <form className="mt-4 bg-slate-200 p-4 rounded">
      <h2 className="font-medium text-lg mb-2">
        {props.isPlayer
          ? 'Request association with organisation'
          : 'Request association with player'}
      </h2>
      <label className="text-sm ">
        Alias
        <input
          value={alias}
          onChange={(event) => {
            setAlias(event.currentTarget.value);
          }}
          placeholder="Alias"
          className="input input-bordered w-full max-w-xs block mb-4"
        />
      </label>
      <button
        className="btn btn-secondary rounded-full "
        formAction={async () => {
          await requestAssociationByOrganisationHandler();
        }}
      >
        Send request
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
