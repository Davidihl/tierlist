import Image from 'next/image';
import Link from 'next/link';
import groupIcon from '../../public/group.svg';
import { OrganisationQuery } from './page';

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
      <div className="text-xs flex items-center relative">
        <div className="indicator">
          <span className="indicator-item badge badge-secondary">
            {props.organisation.associations.length}
          </span>
          <Image
            src={groupIcon}
            width={28}
            height={28}
            alt="Players associated with icon"
          />
        </div>
      </div>
    </div>
  );
}
