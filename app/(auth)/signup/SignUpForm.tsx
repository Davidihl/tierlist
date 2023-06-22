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

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [isPlayer, setIsPlayer] = useState(true);
  const [topping, setTopping] = useState('Medium');
  const [onError, setOnError] = useState('');
  const router = useRouter();

  // const [loginHandler] = useMutation(loginMutation, {
  //   variables: {
  //     username,
  //     password,
  //   },

  //   onError: (error) => {
  //     setOnError(error.message);
  //   },

  //   onCompleted: () => {
  //     setOnError('');
  //     router.refresh();
  //   },
  // });

  return (
    <form>
      <div>
        <p>I am a:</p>
        <label>
          Player
          <input
            type="checkbox"
            checked={isPlayer}
            onChange={() => setIsPlayer(!isPlayer)}
            className="radio radio-primary"
          />
        </label>
        <label>
          Organization
          <input
            type="checkbox"
            checked={!isPlayer}
            onChange={() => setIsPlayer(!isPlayer)}
            className="radio radio-primary"
          />
        </label>
      </div>
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
          formAction={() => {
            console.log(accountType);
          }}
          className="btn btn-primary rounded-full"
        >
          <span className="loading loading-spinner loading-sm" />
          Login
        </button>
        <Link href="/login">Already have a login? Login here instead!</Link>
      </div>
      <div>{onError}</div>
    </form>
  );
}
