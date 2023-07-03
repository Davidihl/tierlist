import { gql } from '@apollo/client';
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
            alias
            mainAccount {
              tier
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
    <div className="mt-4">
      <h2 className="font-medium text-lg mb-2">Pending requests:</h2>
      {data.organisationAssociationsPending ? (
        data.organisationAssociationsPending.map((association: any) => {
          return (
            <div
              key={`player-${association.player.alias}`}
              className="flex gap-2 justify-between max-w-lg border-b p-2 first:border-t"
            >
              <Player player={association.player} showOrganisation={false} />

              <div className="flex items-center">
                <EndAssociation id={association.id} />
              </div>
            </div>
          );
        })
      ) : (
        <p>No pending requests</p>
      )}
    </div>
  );
}
