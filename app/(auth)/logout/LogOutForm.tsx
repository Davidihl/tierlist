'use client';

import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const logoutMutation = gql`
  mutation Logout($token: String!) {
    logout(token: $token) {
      token
    }
  }
`;

type Props = {
  token: string;
};

export default function LogOutForm(props: Props) {
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [logoutHandler] = useMutation(logoutMutation, {
    variables: {
      token: props.token,
    },

    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: () => {
      router.refresh();
    },
  });
  return (
    <form className="flex flex-col gap-4">
      <p>Are you sure you want to logout?</p>
      <div>
        <button
          className="btn btn-primary rounded-full"
          formAction={async () => {
            await logoutHandler();
          }}
        >
          Confirm logout
        </button>
        {onError}
      </div>
    </form>
  );
}
