import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import LeagueAccount from '../../../components/LeagueAccount';
import { LeagueAccountQuery } from '../../../database/leagueAccounts';
import { getValidSessionByToken } from '../../../database/sessions';
import updateIcon from '../../../public/update.svg';
import { getClient } from '../../../util/apolloClient';
import AddLeagueAccount from './AddLeagueAccount';
import AssociationBadge from './AssociationBadge';
import AssociationRequestsList from './AssociationRequestsList';
import DeleteLeagueAccount from './DeleteLeagueAccount';
import SetMainAccount from './SetMainAccount';

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata(props: Props) {
  const { data } = await getClient().query({
    query: gql`
      query PlayerBySlug($slug: String!) {
        playerBySlug(slug: $slug) {
          alias
        }
      }
    `,
    variables: {
      slug: props.params.slug,
    },
  });

  if (!data.playerBySlug) {
    return {
      title: 'Player not found',
      description: 'Could not find the player you are looking for',
    };
  }

  return {
    title: `Player Profile for ${data.playerBySlug.alias}`,
    description: `This is the player profile page for ${data.playerBySlug.alias}. You can look up contact information or the various league of legends accounts he claims to have access to.`,
  };
}

export default async function PlayerPage(props: Props) {
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));
  const { data } = await getClient().query({
    query: gql`
      query PlayerBySlug($slug: String!) {
        playerBySlug(slug: $slug) {
          id
          alias
          firstName
          lastName
          contact
          user {
            id
          }
          mainAccount {
            id
            tier
          }
          leagueAccounts {
            id
            summoner
            tier
            rank
            leaguePoints
            wins
            losses
          }
        }
      }
    `,
    variables: {
      slug: props.params.slug,
    },
  });

  if (!data.playerBySlug) {
    notFound();
  }

  const leagueAccounts = data.playerBySlug.leagueAccounts;
  const allowEdit = session?.userId === Number(data.playerBySlug.user.id);

  return (
    <main className="p-4 min-w-sm">
      <div className="flex gap-4 items-center">
        {data.playerBySlug.mainAccount?.tier ? (
          <Image
            src={`/leagueoflegends/tiers/${data.playerBySlug.mainAccount.tier}.webp`}
            alt={`Tier ${data.playerBySlug.mainAccount.tier}`}
            width={100}
            height={100}
          />
        ) : (
          <Image
            src="/leagueoflegends/tiers/UNRANKED.webp"
            alt="Unranked"
            width={100}
            height={100}
          />
        )}
        <div>
          <h1 className="font-medium text-xl">{data.playerBySlug.alias}</h1>
          {data.playerBySlug.firstName && data.playerBySlug.lastName ? (
            <p>
              <span>{data.playerBySlug.firstName}</span>{' '}
              <span>{data.playerBySlug.lastName}</span>
            </p>
          ) : (
            ''
          )}
          {data.playerBySlug.contact ? (
            <p>Contact: {data.playerBySlug.contact}</p>
          ) : (
            ''
          )}
          <AssociationBadge />
        </div>
      </div>
      {allowEdit && (
        <AssociationRequestsList playerId={Number(data.playerBySlug.id)} />
      )}

      <div className="mt-4">
        <h2 className="font-medium text-lg">Assigned Accounts:</h2>
        <div>
          {!data.playerBySlug.mainAccount?.tier && allowEdit && (
            <div className="alert alert-warning mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Warning: No League of Legends account assigned!</span>
            </div>
          )}
          {leagueAccounts.map((leagueAccount: LeagueAccountQuery) => (
            <div
              className="flex gap-2 justify-between max-w-lg border-b p-2 first:border-t"
              key={`league-account-${leagueAccount.id}`}
            >
              <LeagueAccount leagueAccount={leagueAccount} />
              {allowEdit ? (
                <div className="flex items-center">
                  {data.playerBySlug.mainAccount?.id !== leagueAccount.id ? (
                    <SetMainAccount
                      leagueAccountId={leagueAccount.id}
                      playerId={data.playerBySlug.id}
                    />
                  ) : (
                    ''
                  )}
                  <DeleteLeagueAccount leagueAccountId={leagueAccount.id} />
                </div>
              ) : (
                ''
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        {leagueAccounts.length > 0 ? (
          <button className="flex items-center btn rounded-full group">
            <Image
              src={updateIcon}
              alt="Update Icon"
              className="group-hover:animate-reverse-spin"
            />
            Update Riot Data
          </button>
        ) : !allowEdit ? (
          <div className="alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              This player has not assigned any League of Legends account yet.
            </span>
          </div>
        ) : (
          ''
        )}
      </div>
      {allowEdit ? <AddLeagueAccount /> : ''}
    </main>
  );
}
