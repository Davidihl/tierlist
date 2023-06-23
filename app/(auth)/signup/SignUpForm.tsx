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

const createUserMutation = gql`
  mutation createUser($alias: String!, $username: String, $password: String) {
    createUser(alias: $alias, username: $username, password: $password) {
      id
    }
  }
`;

const createPlayerMutation = gql`
  mutation CreatePlayer(
    $userId: Int!
    $alias: String!
    $firstName: String
    $lastName: String
    $contact: String
  ) {
    createPlayer(
      userId: $userId
      alias: $alias
      firstName: $firstName
      lastName: $lastName
      contact: $contact
    ) {
      id
      alias
    }
  }
`;

const createOrganisationMutation = gql`
  mutation CreateOrganisation(
    $userId: Int!
    $organisationName: String!
    $contact: String
  ) {
    createOrganisation(
      userId: $userId
      organisationName: $organisationName
      contact: $contact
    ) {
      id
    }
  }
`;

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [contact, setContact] = useState('');
  const [isPlayer, setIsPlayer] = useState(true);
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

  const [createPlayerHandler] = useMutation(createPlayerMutation, {
    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: async () => {
      setOnError('');
      await loginHandler();
    },
  });

  const [createOrganisationHandler] = useMutation(createOrganisationMutation, {
    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: async () => {
      setOnError('');
      await loginHandler();
    },
  });

  const [createUserHandler] = useMutation(createUserMutation, {
    variables: {
      alias,
      username,
      password,
    },

    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: async (data) => {
      setOnError('');
      if (isPlayer) {
        await createPlayerHandler({
          variables: {
            userId: Number(data.createUser.id),
            alias,
            firstName,
            lastName,
            contact,
          },
        });
      } else {
        await createOrganisationHandler({
          variables: {
            userId: Number(data.createUser.id),
            organisationName,
            contact,
          },
        });
      }
    },
  });

  return (
    <form>
      <div className="flex gap-4">
        <label className="flex items gap-2">
          I am an athlete
          <input
            type="checkbox"
            checked={isPlayer}
            onChange={() => setIsPlayer(!isPlayer)}
            className="radio radio-primary"
          />
        </label>
        <label className="flex items gap-2">
          I am an organisation
          <input
            type="checkbox"
            checked={!isPlayer}
            onChange={() => {
              setIsPlayer(!isPlayer);
              setOrganisationName('');
              setAlias('');
            }}
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
      {isPlayer ? (
        <div>
          <label>
            Alias
            <input
              value={alias}
              onChange={(event) => setAlias(event.currentTarget.value)}
              placeholder="Gamertag"
              className="p-2 block"
            />
          </label>
          <label>
            First name (optional)
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.currentTarget.value)}
              placeholder="First name"
              className="p-2 block"
            />
          </label>
          <label>
            Last name (optional)
            <input
              value={lastName}
              onChange={(event) => setLastName(event.currentTarget.value)}
              placeholder="Last name"
              className="p-2 block"
            />
          </label>
          <label>
            Email contact (optional)
            <input
              value={contact}
              onChange={(event) => setContact(event.currentTarget.value)}
              placeholder="user@email.com"
              className="p-2 block"
            />
          </label>
        </div>
      ) : (
        <div>
          <label>
            Alias
            <input
              value={organisationName}
              onChange={(event) =>
                setOrganisationName(event.currentTarget.value)
              }
              placeholder="Austrian Force"
              className="p-2 block"
            />
          </label>
          <label>
            Email contact (optional)
            <input
              value={contact}
              onChange={(event) => setContact(event.currentTarget.value)}
              placeholder="user@email.com"
              className="p-2 block"
            />
          </label>
        </div>
      )}
      <div className="flex gap-4 items-center">
        <button
          formAction={async () => {
            await createUserHandler();
          }}
          className="btn btn-primary rounded-full"
        >
          <span className="loading loading-spinner loading-sm" />
          Sign up
        </button>
        <Link href="/login">Already have a login? Login here instead!</Link>
      </div>
      <div>{onError}</div>
    </form>
  );
}
