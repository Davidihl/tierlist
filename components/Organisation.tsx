import Image from 'next/image';
import Link from 'next/link';
import { OrganisationQuery } from '../app/organisations/page';
import AssociationBadge from '../app/players/[slug]/AssociationBadge';
import { PlayerQuery } from '../app/players/page';

type Props = {
  organisation: OrganisationQuery;
};

export default function Organisation(props: Props) {
  return (
    <div
      key={`player-${props.organisation.alias}`}
      className="flex gap-2 justify-between p-2 w-full"
    >
      <Link href={`/organisations/${props.organisation.slug}`}>
        <div>{props.organisation.alias}</div>
      </Link>
      <div className="text-xs flex items-center">
        Current player: {props.organisation.associations.length}
      </div>
    </div>
  );
}
