'use client';
import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
  const router = useRouter();

  const [loginHandler] = useMutation(loginMutation, {
    variables: {
      username,
      password,
    },

    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: () => {
      setOnError('');
      router.refresh();
    },
  });

  return (
    <form className="flex flex-col gap-4">
      <label>
        Username
        <input
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
          placeholder="Username"
          className="p-2 block input w-full max-w-xs"
        />
      </label>
      <label>
        Password
        <input
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          type="password"
          placeholder="Password"
          className="p-2 block input w-full max-w-xs"
        />
      </label>
      <div className="flex gap-4 flex-col">
        <button
          formAction={async () => {
            await loginHandler();
          }}
          className="btn btn-primary rounded-full btn-wide"
        >
          Login
        </button>
        <Link href="/signup">No account yet? Sign up here instead!</Link>
      </div>
      <div>{onError}</div>
    </form>
  );
}
