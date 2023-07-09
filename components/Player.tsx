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

  let totalGames;
  let winrate;
  let rank;
  let leaguePoints;

  if (props.player.mainAccount) {
    totalGames =
      Number(props.player.mainAccount.wins) +
      Number(props.player.mainAccount.losses);

    winrate = (Number(props.player.mainAccount.wins) / totalGames) * 100;

    if (
      props.player.mainAccount.tier !== 'CHALLENGER' &&
      props.player.mainAccount.tier !== 'GRANDMASTER' &&
      props.player.mainAccount.tier !== 'MASTER'
    ) {
      rank = ` ${props.player.mainAccount.rank}`;
    }

    if (props.player.mainAccount.tier !== 'UNRANKED') {
      leaguePoints = `${props.player.mainAccount.leaguePoints} LP`;
    }
  }

  return (
    <div className="table-row w-full border-b">
      <div className="table-cell py-2">
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
            {showOrganisation && (
              <AssociationBadge playerId={props.player.id} />
            )}
          </div>
        </div>
      </div>
      <div className="hidden sm:table-cell text-right align-middle text-xs">
        {props.player.mainAccount?.tier === 'UNRANKED'
          ? ''
          : props.player.mainAccount?.tier}
        {rank}
      </div>
      <div className="hidden sm:table-cell text-right align-middle text-xs">
        {leaguePoints}
      </div>
      <div className="hidden sm:table-cell text-right align-middle text-xs">
        {winrate ? winrate.toFixed(2) + '%' : ''}
      </div>
      <div className="hidden sm:table-cell text-right align-middle text-xs">
        {totalGames}
      </div>
      <div className="max-[360px]:hidden table-cell sm:hidden text-right align-middle text-xs">
        <div>
          {props.player.mainAccount?.tier === 'UNRANKED'
            ? ''
            : props.player.mainAccount?.tier}
          {rank ? ` ${rank}` : ''}
        </div>
        <div>{winrate ? winrate.toFixed(2) + '% WR' : ''}</div>
        <div>{totalGames ? totalGames + ' Games' : ''}</div>
      </div>
    </div>
  );
}
