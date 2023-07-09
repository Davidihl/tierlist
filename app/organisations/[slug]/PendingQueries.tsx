import { gql } from '@apollo/client';
import AssociatedPlayer from '../../../components/AssociatedPlayer';
import EndAssociation from '../../../components/EndAssociation';
import Player from '../../../components/Player';
import { getClient } from '../../../util/apolloClient';

type Props = {
  organisationId: number;
};

export default async function PendingQueries(props: Props) {
  const { data } = await getClient().query({
    query: gql`
      query AssociationsPending($organisationAssociationsPendingId: ID!) {
        organisationAssociationsPending(
          id: $organisationAssociationsPendingId
        ) {
          id
          player {
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
      }
    `,
    variables: {
      organisationAssociationsPendingId: props.organisationId,
    },
  });

  return (
    <>
      <h2 className="font-medium text-lg mb-2 mt-8">Pending requests:</h2>
      <div className="hidden sm:table-header-group border-b">
        <div className="table-row text-xs pb-4">
          <div className="table-cell">Alias</div>
          <div className="table-cell text-right">Division</div>
          <div className="table-cell text-right">LP</div>
          <div className="table-cell text-right">Winrate</div>
          <div className="table-cell text-right">Games</div>
        </div>
      </div>
      {data.organisationAssociationsPending ? (
        data.organisationAssociationsPending.map((association: any) => {
          return (
            <div
              key={`player-${association.player.alias}`}
              className="table-row w-full border-b"
            >
              <AssociatedPlayer player={association.player} />

              <div className="table-cell align-middle text-right">
                <EndAssociation id={association.id} />
              </div>
            </div>
          );
        })
      ) : (
        <p>No pending requests</p>
      )}
    </>
  );
}
