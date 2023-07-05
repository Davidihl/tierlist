import { gql } from '@apollo/client';
import Player from '../../components/Player';
import { LeagueAccountQuery } from '../../database/leagueAccounts';
import { getClient } from '../../util/apolloClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Players',
  description: 'Explore players registered in the ESVÖ playerdatabase',
};

export type PlayerQuery = {
  id: number;
  alias: string;
  slug: string;
  mainAccount: LeagueAccountQuery | null;
};

export default async function PlayersPage() {
  const { data, loading } = await getClient().query({
    query: gql`
      query Player {
        players {
          id
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

  if (loading) return <button className="btn loading">loading</button>;

  const players: PlayerQuery[] = data.players;

  return (
    <main className="flex justify-center sm:h-full sm:p-4">
      <div className="shadow-xl w-full max-w-4xl bg-base-100 border-primary sm:border-t-4">
        <div className="card-body">
          <h1 className="font-medium text-xl">Players</h1>
          {players.map((player) => {
            return (
              <div
                key={`player-${player.alias}`}
                className="flex gap-2 justify-between border-b p-2 first:border-t"
              >
                <Player
                  key={`player-${player.alias}`}
                  player={player}
                  showOrganisation={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
