import Image from 'next/image';
import Link from 'next/link';
import AssociationBadge from '../app/players/[slug]/AssociationBadge';
import { PlayerQuery } from '../app/players/page';

type Props = {
  player: PlayerQuery;
  showOrganisation: boolean | undefined;
};

export default function Player(props: Props) {
  const showOrganisation = props.showOrganisation ?? false;
  return (
    <div
      key={`player-${props.player.alias}`}
      className="flex gap-2 justify-between p-2 "
    >
      <div className="flex gap-2 items-center ">
        {props.player.mainAccount ? (
          <Image
            src={`/leagueoflegends/tiers/${props.player.mainAccount.tier}.webp`}
            alt={`Tier ${props.player.mainAccount.tier}`}
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
        <div>
          <Link href={`/players/${props.player.slug}`}>
            <div>{props.player.alias}</div>
          </Link>
          {showOrganisation && <AssociationBadge playerId={props.player.id} />}
        </div>
      </div>
    </div>
  );
}
