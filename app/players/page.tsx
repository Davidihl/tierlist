import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { LeagueAccountQuery } from '../../database/leagueAccounts';
import { getValidSessionByToken } from '../../database/sessions';
import { getClient } from '../../util/apolloClient';

export const metadata = {
  title: 'Players',
  description: 'Explore players registered in the ESVÖ playerdatabase',
};

type PlayerQuery = {
  alias: string;
  slug: string;
  mainAccount: LeagueAccountQuery | null;
};

export default async function PlayersPage() {
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));
  const { data } = await getClient().query({
    query: gql`
      query Player {
        players {
          alias
          slug
          mainAccount {
            id
            summoner
            tier
            rank
            leaguePoints
            wins
            losses
            lastUpdate
          }
        }
      }
    `,
  });

  const players: PlayerQuery[] = data.players;

  return (
    <main className="p-4">
      <h1 className="font-medium text-xl">Players</h1>
      {players.map((player) => {
        return (
          <div
            key={`player-${player.alias}`}
            className="flex gap-2 justify-between max-w-lg border-b p-2 first:border-t"
          >
            <div className="flex gap-2 items-center ">
              {player.mainAccount ? (
                <Image
                  src={`/leagueoflegends/tiers/${player.mainAccount.tier}.webp`}
                  alt={`Tier ${player.mainAccount?.tier}`}
                  width={50}
                  height={50}
                />
              ) : (
                <Image
                  src="/leagueoflegends/tiers/UNRANKED.webp"
                  alt="Unranked"
                  width={50}
                  height={50}
                />
              )}
              <Link href={`/players/${player.slug}`}>{player.alias}</Link>
            </div>
          </div>
        );
      })}
    </main>
  );
}
