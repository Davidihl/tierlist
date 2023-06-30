'use client';
import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import deleteIcon from '../../../public/delete.svg';
import markMainIcon from '../../../public/markmain.svg';
import moreIcon from '../../../public/more.svg';

type Props = {
  leagueAccountId: number;
  playerId: number;
};

const setMainAccountMutation = gql`
  mutation SetMainAccount($leagueAccountId: Int!, $playerId: Int!) {
    setMainAccount(leagueAccountId: $leagueAccountId, playerId: $playerId) {
      id
      mainAccount {
        id
        summoner
        tier
        rank
        leaguePoints
        wins
        losses
        lastUpdate
        player {
          alias
        }
      }
    }
  }
`;

const deleteLeagueAccountMutation = gql`
  mutation DeleteLeagueAccount($deleteLeagueAccountId: Int!) {
    deleteLeagueAccount(id: $deleteLeagueAccountId) {
      id
    }
  }
`;

export default function LeagueAccountMoreButton(props: Props) {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  const [onError, setOnError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  const handleClickOutside = () => {
    setShow(false);
  };

  const handleClickInside = () => {
    setShow(!show);
  };

  useOnClickOutside(ref, handleClickOutside);

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
    <div ref={ref} className="relative">
      <button
        className="btn btn-ghost btn-circle normal-case font-normal"
        onClick={() => handleClickInside()}
        ref={ref}
      >
        <Image src={moreIcon} alt="Profile" />
      </button>

      <ul
        className={`${
          show ? '' : 'hidden'
        } absolute right-0 top-12 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-60`}
      >
        <li>
          <button
            className="normal-case font-normal flex items-center justify-between"
            onClick={async () => {
              setOnError('');
              await setMainAccountHandler();
              setShow(false);
            }}
          >
            Flag as main account
            <Image src={markMainIcon} alt="Mark Main Account Icon" />
          </button>
        </li>
        <li>
          <button
            className="normal-case font-normal flex items-center justify-between"
            onClick={async () => {
              setOnError('');
              await deleteLeagueAccountHandler();
              setShow(false);
            }}
          >
            Remove
            <Image src={deleteIcon} alt="Remove league of legends account" />
          </button>
        </li>
      </ul>
      {showNotification ? (
        <div className="toast toast-center ">
          <div className="alert alert-error">
            <span>{onError}</span>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
