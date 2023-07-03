'use client';
import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const loginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
    }
  }
`;

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [onError, setOnError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showNotification]);

  const [loginHandler] = useMutation(loginMutation, {
    variables: {
      username,
      password,
    },

    onError: (error) => {
      setOnError(error.message);
      setShowNotification(true);
    },

    onCompleted: () => {
      setOnError('');
      router.refresh();
    },
  });

  return (
    <form className="flex flex-col gap-4">
      <label className="label-text">
        Username
        <input
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
          placeholder="Username"
          className="mt-1 p-2 block input input-bordered w-full"
        />
      </label>
      <label className="label-text">
        Password
        <input
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          type="password"
          placeholder="Password"
          className="mt-1 p-2 block input input-bordered w-full"
        />
      </label>
      <div className="flex gap-4 flex-col items-center">
        <button
          formAction={async () => {
            await loginHandler();
          }}
          className="btn btn-primary rounded-full btn-wide"
        >
          Login
        </button>
        <Link className="link text-xs" href="/signup">
          No account yet? Sign up here instead!
        </Link>
      </div>
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
