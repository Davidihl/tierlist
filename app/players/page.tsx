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

  const players: PlayerQuery[] = data?.players;

  return (
    <main className="flex justify-center sm:p-4">
      <div className="shadow-xl w-full max-w-4xl bg-base-100 border-primary sm:border-t-4">
        <div className="card-body">
          <h1 className="font-medium text-xl">Players</h1>
          <div className="table border-collapse table-auto w-full">
            <div className="hidden sm:table-header-group">
              <div className="table-row text-xs pb-4">
                <div className="table-cell">Alias</div>
                <div className="table-cell text-right">Division</div>
                <div className="table-cell text-right">LP</div>
                <div className="table-cell text-right">Winrate</div>
                <div className="table-cell text-right">Games</div>
              </div>
            </div>
            {players.map((player) => {
              return (
                <Player
                  key={`player-${player.alias}`}
                  player={player}
                  showOrganisation={true}
                />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
