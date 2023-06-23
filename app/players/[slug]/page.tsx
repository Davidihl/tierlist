import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import LeagueAccount from '../../../components/LeagueAccount';
import { LeagueAccountQuery } from '../../../database/leagueAccounts';
import { getPlayerBySlug } from '../../../database/players';
import { getValidSessionByToken } from '../../../database/sessions';
import { getClient } from '../../../util/apolloClient';
import AddLeagueAccount from './AddLeagueAccount';

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    slug: string;
  };
};

export default async function PlayerPage(props: Props) {
  const playerData = await getPlayerBySlug(props.params.slug);
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));
  const allowEdit = session?.userId === playerData?.userId;

  if (!playerData) {
    notFound();
  }

  const { data } = await getClient().query({
    query: gql`
      query Player($playerId: ID!) {
        player(id: $playerId) {
          leagueAccounts {
            id
            isMainAccount
            lastUpdate
            leaguePoints
            losses
            rank
            summoner
            tier
            wins
          }
        }
      }
    `,
    variables: {
      playerId: playerData.id,
    },
  });

  return (
    <main className="p-4">
      <h1 className="font-medium text-xl">{playerData.alias}</h1>
      {playerData.firstName && playerData.lastName ? (
        <p>
          <span>{playerData.firstName}</span> <span>{playerData.lastName}</span>
        </p>
      ) : (
        ''
      )}
      {playerData.contact ? <p>Contact: {playerData.contact}</p> : ''}
      {allowEdit ? <AddLeagueAccount /> : ''}
      <div>
        <h2>Assigned Accounts:</h2>
        {data.player.leagueAccounts.map((leagueAccount: LeagueAccountQuery) => (
          <LeagueAccount
            key={`league-account-${leagueAccount.id}`}
            leagueAccount={leagueAccount}
          />
        ))}
      </div>
    </main>
  );
}
