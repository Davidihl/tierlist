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

const createUserMutation = gql`
  mutation CreateUser(
    $alias: String!
    $username: String
    $password: String
    $repeatPassword: String
  ) {
    createUser(
      alias: $alias
      username: $username
      password: $password
      repeatPassword: $repeatPassword
    ) {
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
    $alias: String!
    $contact: String
  ) {
    createOrganisation(userId: $userId, alias: $alias, contact: $contact) {
      id
    }
  }
`;

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [isPlayer, setIsPlayer] = useState(true);
  const [onError, setOnError] = useState('');
  const [graphQlError, setGraphQlError] = useState('');
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

  const [createPlayerHandler] = useMutation(createPlayerMutation, {
    onError: (error) => {
      setOnError(error.message);
      setShowNotification(true);
    },

    onCompleted: async () => {
      setOnError('');
      await loginHandler();
    },
  });

  const [createOrganisationHandler] = useMutation(createOrganisationMutation, {
    onError: (error) => {
      setOnError(error.message);
      setShowNotification(true);
    },

    onCompleted: async () => {
      setOnError('');
      await loginHandler();
    },
  });

  const [createUserHandler] = useMutation(createUserMutation, {
    variables: {
      username,
      password,
      repeatPassword,
      alias,
    },

    onError: (error) => {
      setOnError(error.message);
      const errorCode: any = error.graphQLErrors[0]?.extensions.code;
      setGraphQlError(errorCode);
      setShowNotification(true);
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
            alias,
            contact,
          },
        });
      }
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
          className={`mt-1 p-2 block input input-bordered w-full ${
            graphQlError === '40001' ? 'input-error' : ''
          } ${graphQlError === '40002' ? 'input-error' : ''}`}
        />
      </label>
      <label className="label-text">
        Password
        <input
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          type="password"
          placeholder="Password"
          className={`mt-1 p-2 block input input-bordered w-full ${
            graphQlError === '40001' ? 'input-error' : ''
          } ${graphQlError === '40003' ? 'input-error' : ''}`}
        />
      </label>
      <label className="label-text">
        Repeat Password
        <input
          value={repeatPassword}
          onChange={(event) => setRepeatPassword(event.currentTarget.value)}
          type="password"
          placeholder="Repeat password"
          className={`mt-1 p-2 block input input-bordered w-full ${
            graphQlError === '40001' ? 'input-error' : ''
          } ${graphQlError === '40003' ? 'input-error' : ''}`}
        />
      </label>
      <div>
        <h2>I am signing up as:</h2>
        <div className="flex gap-4 mt-4">
          <label className="label-text flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPlayer}
              onChange={() => setIsPlayer(!isPlayer)}
              className="radio radio-primary"
            />
            I am an athlete
          </label>
          <label className="label-text flex items-center gap-2">
            <input
              type="checkbox"
              checked={!isPlayer}
              onChange={() => {
                setIsPlayer(!isPlayer);
                setAlias('');
              }}
              className="radio radio-primary"
            />
            I am an organisation
          </label>
        </div>
      </div>
      {isPlayer ? (
        <div className="flex flex-col gap-4">
          <label className="label-text">
            Alias
            <input
              value={alias}
              onChange={(event) => setAlias(event.currentTarget.value)}
              placeholder="Gamertag"
              className={`mt-1 p-2 block input input-bordered w-full ${
                graphQlError === '40001' ? 'input-error' : ''
              } ${graphQlError === '40004' ? 'input-error' : ''} ${
                graphQlError === '40006' ? 'input-error' : ''
              }`}
            />
          </label>
          <label className="label-text">
            First name (optional)
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.currentTarget.value)}
              placeholder="First name"
              className="mt-1 p-2 block input input-bordered w-full"
            />
          </label>
          <label className="label-text">
            Last name (optional)
            <input
              value={lastName}
              onChange={(event) => setLastName(event.currentTarget.value)}
              placeholder="Last name"
              className="mt-1 p-2 block input input-bordered w-full"
            />
          </label>
          <label className="label-text">
            Email contact (optional)
            <input
              value={contact}
              onChange={(event) => setContact(event.currentTarget.value)}
              placeholder="user@email.com"
              className="mt-1 p-2 block input input-bordered w-full"
            />
          </label>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <label className="label-text">
            Alias
            <input
              value={alias}
              onChange={(event) => setAlias(event.currentTarget.value)}
              placeholder="Your Organisation Name"
              className={`mt-1 p-2 block input input-bordered w-full ${
                graphQlError === '40001' ? 'input-error' : ''
              } ${graphQlError === '40004' ? 'input-error' : ''}`}
            />
          </label>
          <label className="label-text">
            Email contact (optional)
            <input
              value={contact}
              onChange={(event) => setContact(event.currentTarget.value)}
              placeholder="user@email.com"
              className="mt-1 p-2 block input input-bordered w-full"
            />
          </label>
        </div>
      )}
      <div className="flex gap-4 flex-col items-center">
        <button
          formAction={async () => {
            setGraphQlError('');
            await createUserHandler();
          }}
          className="btn btn-primary rounded-full btn-wide"
        >
          Sign up
        </button>
        <Link className="link text-xs" href="/login">
          Already have a login? Login here instead!
        </Link>
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
    </form>
  );
}
