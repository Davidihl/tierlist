import { gql } from '@apollo/client';
import Link from 'next/link';
import { getClient } from '../../../util/apolloClient';
import AcceptAssociation from './AcceptAssociation';
import DenyAssociation from './DenyAssociation';

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
      {data.playersAssociationsPending.length !== 0 && (
        <h2 className="font-medium text-lg mb-2">Association Invites</h2>
      )}
      {data.playersAssociationsPending.length !== 0 &&
        data.playersAssociationsPending.map((association: any) => {
          return (
            <div
              key={`player-${association.id}`}
              className="flex flex-col justify-between max-w-lg p-1"
            >
              <div className="shadow-md w-full max-w-lg bg-base-100 border-secondary sm:border-l-2 p-4 flex gap-4 justify-between">
                <div>
                  <Link
                    className="font-medium"
                    href={`/organisations/${association.organisation.slug}`}
                  >
                    {association.organisation.alias}
                  </Link>
                </div>
                <div className="flex gap-2">
                  <DenyAssociation id={association.id} />
                  <AcceptAssociation
                    id={association.id}
                    playerId={props.playerId}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
