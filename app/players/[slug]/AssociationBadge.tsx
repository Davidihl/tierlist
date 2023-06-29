import { gql } from '@apollo/client';
import Link from 'next/link';
import { getClient } from '../../../util/apolloClient';

type Props = {
  playerId: number;
};

export default async function AssociationBadge(props: Props) {
  const { data } = await getClient().query({
    query: gql`
      query PlayerAssociationsByPlayerId($playerAssociationsByPlayerIdId: ID!) {
        playerAssociationsByPlayerId(id: $playerAssociationsByPlayerIdId) {
          organisation {
            alias
          }
        }
      }
    `,
    variables: {
      playerAssociationsByPlayerIdId: props.playerId,
    },
  });

  console.log(data.playerAssociationsByPlayerId);

  if (data.playerAssociationsByPlayerId) {
    return (
      <div className="badge badge-primary">
        {data.playerAssociationsByPlayerId.organisation.alias}
      </div>
    );
  }
}
