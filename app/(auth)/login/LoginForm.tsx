'use client';
import { gql, useMutation } from '@apollo/client';
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
      router.replace(`/`);
      router.refresh();
    },
  });
  return (
    <form>
      <label>
        Username
        <input
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
          placeholder="Username"
          className="p-2 block"
        />
      </label>
      <label>
        Password
        <input
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          type="password"
          placeholder="Password"
          className="p-2 block"
        />
      </label>
      <div className="flex gap-4 items-center">
        <button
          formAction={async () => {
            await loginHandler();
            console.log('click');
          }}
          className="btn btn-primary rounded-full"
        >
          <span className="loading loading-spinner loading-sm" />
          Login
        </button>
        <button
          formAction={() => console.log('it works')}
          className="btn btn-secondary rounded-full group"
        >
          <span className="w-0 group-hover:loading loading-spinner group-hover:loading-sm transition-all" />
          Sign up
        </button>
      </div>
      <div>{onError}</div>
    </form>
  );
}
