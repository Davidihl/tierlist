import Image from 'next/image';
import Link from 'next/link';
import { PlayerQuery } from '../app/players/page';

type Props = {
  player: PlayerQuery;
};

export default function AssociatedPlayer(props: Props) {
  return (
    <div key={`player-${props.player.alias}`}>
      <div>
        <div className="flex gap-2 items-center ">
          {props.player.mainAccount ? (
            <Image
              src={`/leagueoflegends/tiers/${props.player.mainAccount.tier}.webp`}
              alt={`Tier ${props.player.mainAccount.tier}`}
              className="w-10"
              width={50}
              height={50}
            />
          ) : (
            <Image
              src="/leagueoflegends/tiers/UNRANKED.webp"
              alt="Unranked"
              className="w-10"
              width={50}
              height={50}
            />
          )}
          <div>
            <Link href={`/players/${props.player.slug}`}>
              <div>{props.player.alias}</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
