import { gql } from '@apollo/client';
import Link from 'next/link';
import EndAssociation from '../../../components/EndAssociation';
import Player from '../../../components/Player';
import acceptIcon from '../../../public/accept.svg';
import { getClient } from '../../../util/apolloClient';

export const dynamic = 'force-dynamic';

type Props = {
  playerId: number;
};

export default async function AssociationRequestsList(props: Props) {
  const { data } = await getClient().query({
    query: gql`
      query AssociationRequests($playersAssociationsPendingId: ID!) {
        playersAssociationsPending(id: $playersAssociationsPendingId) {
          id
          organisation {
            id
            alias
            slug
          }
        }
      }
    `,
    variables: {
      playersAssociationsPendingId: props.playerId,
    },
  });

  return (
    <div className="mt-4">
      <h2 className="font-medium text-lg">Association invites:</h2>
      {data.playersAssociationsPending ? (
        data.playersAssociationsPending.map((association: any) => {
          return (
            <div
              key={`player-${association.id}`}
              className="flex justify-between max-w-lg p-1"
            >
              <div className="alert flex justify-between">
                <div>
                  <Link
                    href={`/organisations/${association.organisation.slug}`}
                  >
                    {association.organisation.alias}
                  </Link>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm rounded-full">Deny</button>
                  <button className="btn btn-sm btn-primary rounded-full">
                    Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No association invites</p>
      )}
    </div>
  );
}
