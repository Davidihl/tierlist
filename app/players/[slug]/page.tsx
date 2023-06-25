import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import LeagueAccount from '../../../components/LeagueAccount';
import { LeagueAccountQuery } from '../../../database/leagueAccounts';
import { getPlayerBySlug } from '../../../database/players';
import { getValidSessionByToken } from '../../../database/sessions';
import deleteIcon from '../../../public/delete.svg';
import markMainIcon from '../../../public/markmain.svg';
import updateIcon from '../../../public/update.svg';
import { getClient } from '../../../util/apolloClient';
import AddLeagueAccount from './AddLeagueAccount';

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    slug: string;
  };
};

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
  const leagueAccounts = data.playerBySlug.leagueAccounts;

  if (!data) {
    notFound();
  }

  const allowEdit = session?.userId === Number(data.playerBySlug.user.id);
  console.log(data);
  console.log(data.playerBySlug.leagueAccounts);
  console.log(data.playerBySlug.leagueAccounts[0].id);

  return (
    <main className="p-4">
      <h1 className="font-medium text-xl">{data.playerBySlug.alias}</h1>
      {data.playerBySlug.firstName && data.playerBySlug.lastName ? (
        <p>
          <span>{data.playerBySlug.firstName}</span>{' '}
          <span>{data.playerBySlug.lastName}</span>
        </p>
      ) : (
        ''
      )}
      {data.contact ? <p>Contact: {data.contact}</p> : ''}
      {allowEdit ? <AddLeagueAccount /> : ''}
      <div className="mt-4">
        <h2 className="font-medium text-lg">Assigned Accounts:</h2>
        <div>
          {leagueAccounts.map((leagueAccount: LeagueAccountQuery) => (
            <div
              className="flex gap-2 justify-between max-w-md border-b p-2 first:border-t"
              key={`league-account-${leagueAccount.id}`}
            >
              <LeagueAccount leagueAccount={leagueAccount} />
              {allowEdit ? (
                <div className="flex items-center">
                  {data.playerBySlug.mainAccount.id !== leagueAccount.id ? (
                    <button className="btn btn-circle mr-2">
                      <Image src={markMainIcon} alt="Mark Main Account Icon" />
                    </button>
                  ) : (
                    ''
                  )}
                  <button className="btn btn-circle mr-2">
                    <Image src={deleteIcon} alt="Delete Icon" />
                  </button>
                </div>
              ) : (
                ''
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <button className="flex items-center btn rounded-full group">
          <Image
            src={updateIcon}
            alt="Update Icon"
            className="group-hover:animate-reverse-spin"
          />
          Update Riot Data
        </button>
      </div>
    </main>
  );
}
