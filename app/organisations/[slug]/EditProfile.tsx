'use client';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { encodeString } from '../../../util/encodeString';

const editOrganisationMutation = gql`
  mutation editOrganisation(
    $organisationId: ID!
    $userId: Int!
    $username: String
    $alias: String
    $contact: String
    $oldPassword: String
    $newPassword: String
    $repeatPassword: String
  ) {
    editOrganisation(
      organisationId: $organisationId
      userId: $userId
      username: $username
      alias: $alias
      contact: $contact
      oldPassword: $oldPassword
      newPassword: $newPassword
      repeatPassword: $repeatPassword
    ) {
      id
    }
  }
`;

const deleteOrganisationMutation = gql`
  mutation deleteOrganisation($organisationId: ID!, $userId: ID!) {
    deleteOrganisation(organisationId: $organisationId, userId: $userId) {
      id
    }
  }
`;

type Props = {
  organisation: {
    id: number;
    alias: string;
    contact: string;
    slug: string;
    user: {
      id: number;
      username: string;
    };
  };
  userId: number;
};

export default function EditProfile(props: Props) {
  const [open, setOpen] = useState(false);
  const [onError, setOnError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [username, setUsername] = useState(props.organisation.user.username);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [alias, setAlias] = useState(props.organisation.alias);
  const [contact, setContact] = useState(props.organisation.contact);
  const [graphQlError, setGraphQlError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showNotification]);

  const [editOrganisationHandler] = useMutation(editOrganisationMutation, {
    variables: {
      organisationId: props.organisation.id,
      userId: props.userId,
      username,
      alias,
      contact,
      oldPassword,
      newPassword,
      repeatPassword,
    },

    onError: (error) => {
      setOnError(error.message);
      const errorCode: any = error.graphQLErrors[0]?.extensions.code;
      setGraphQlError(errorCode);
      setShowNotification(true);
    },

    onCompleted: () => {
      setOnError('');
      setOldPassword('');
      setNewPassword('');
      setRepeatPassword('');
      setOpen(false);
      router.push(`/organisations/${encodeString(alias.toLowerCase())}`);
    },
  });

  const [deleteOrganisationHandler] = useMutation(deleteOrganisationMutation, {
    variables: {
      organisationId: props.organisation.id,
      userId: props.userId,
    },

    onError: (error) => {
      setOnError(error.message);
      const errorCode: any = error.graphQLErrors[0]?.extensions.code;
      setGraphQlError(errorCode);
      setShowNotification(true);
    },

    onCompleted: () => {
      setOnError('');
      setOpen(false);
      router.push('/');
    },
  });

  return (
    <>
      <button
        className="btn btn-circle absolute right-4 top-4"
        onClick={() => setOpen(!open)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path d="M754.306-613.77 619.309-747.537l52.538-52.538q17.231-17.23 42.461-17.23 25.23 0 42.46 17.23l49.461 49.461q17.231 17.23 17.846 41.845.615 24.615-16.615 41.845l-53.154 53.154Zm-43.383 43.999-429.77 429.77H146.156v-134.998l429.769-429.77 134.998 134.998Z" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-0 left-0 right-0">
          <form className="flex flex-col items-center shadow-xl w-full max-w-4xl bg-base-100 p-4">
            <div className="flex justify-between items-center w-full">
              <h2 className="font-medium text-lg mb-2">Edit Profile</h2>
              <button
                className="btn btn-ghost btn-circle"
                onClick={() => setOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M256-213.847 213.847-256l224-224-224-224L256-746.153l224 224 224-224L746.153-704l-224 224 224 224L704-213.847l-224-224-224 224Z" />
                </svg>
              </button>
            </div>
            <div className="w-full max-w-lg">
              <div className="flex flex-col gap-4">
                <label className="label-text">
                  Username
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.currentTarget.value)}
                    placeholder="Username"
                    className={`mt-1 p-2 block input input-bordered w-full ${
                      graphQlError === '40001' ? 'input-error' : ''
                    }`}
                  />
                </label>
                <label className="label-text">
                  Old Password
                  <input
                    value={oldPassword}
                    onChange={(event) =>
                      setOldPassword(event.currentTarget.value)
                    }
                    type="password"
                    placeholder="Password"
                    className={`mt-1 p-2 block input input-bordered w-full ${
                      graphQlError === '40002' ? 'input-error' : ''
                    } ${graphQlError === '40002' ? 'input-error' : ''}`}
                  />
                </label>
                <label className="label-text">
                  New Password
                  <input
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.currentTarget.value)
                    }
                    type="password"
                    placeholder="Password"
                    className={`mt-1 p-2 block input input-bordered w-full ${
                      graphQlError === '40003' ? 'input-error' : ''
                    }`}
                  />
                </label>
                <label className="label-text">
                  Repeat Password
                  <input
                    value={repeatPassword}
                    onChange={(event) =>
                      setRepeatPassword(event.currentTarget.value)
                    }
                    type="password"
                    placeholder="Repeat password"
                    className={`mt-1 p-2 block input input-bordered w-full ${
                      graphQlError === '40003' ? 'input-error' : ''
                    }`}
                  />
                </label>
                <label className="label-text">
                  Alias
                  <input
                    value={alias}
                    onChange={(event) => setAlias(event.currentTarget.value)}
                    placeholder="Your Organisation Name"
                    className={`mt-1 p-2 block input input-bordered w-full
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
              <div className="flex flex-col items-center gap-4 mt-4">
                <button
                  formAction={async () => {
                    setOnError('');
                    await editOrganisationHandler();
                    router.refresh();
                  }}
                  className="btn btn-primary rounded-full"
                >
                  Save Changes
                </button>
                <button
                  formAction={async () => {
                    setOnError('');
                    await deleteOrganisationHandler();
                    console.log('delete');
                    router.refresh();
                  }}
                  className="link text-xs"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </form>
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
      )}
    </>
  );
}
