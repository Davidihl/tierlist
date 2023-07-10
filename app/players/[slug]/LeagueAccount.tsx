import Image from 'next/image';
import { LeagueAccountQuery } from '../../../database/leagueAccounts';

type Props = {
  leagueAccount: LeagueAccountQuery;
};

export default function LeagueAccount(props: Props) {
  const totalGames =
    Number(props.leagueAccount.wins) + Number(props.leagueAccount.losses);

  const winrate = (Number(props.leagueAccount.wins) / totalGames) * 100;

  let rank;
  let leaguePoints;

  if (
    props.leagueAccount.tier !== 'CHALLENGER' &&
    props.leagueAccount.tier !== 'GRANDMASTER' &&
    props.leagueAccount.tier !== 'MASTER'
  ) {
    rank = ` ${props.leagueAccount.rank}`;
  }

  if (props.leagueAccount.tier !== 'UNRANKED') {
    leaguePoints = `${props.leagueAccount.leaguePoints} LP`;
  }

  return (
    <>
      <div className="table-cell py-2">
        <div className="flex gap-2 items-center">
          <Image
            src={`/leagueoflegends/tiers/${props.leagueAccount.tier}.webp`}
            alt={`Tier ${props.leagueAccount.tier}`}
            width={50}
            height={50}
          />
          <div>
            <div>{props.leagueAccount.summoner}</div>
            <div className="text-xs">
              Last Update: {props.leagueAccount.lastUpdate.toString()}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:table-cell text-right align-middle text-xs">
        {props.leagueAccount.tier === 'UNRANKED'
          ? ''
          : props.leagueAccount.tier}
        {rank}
      </div>
      <div className="hidden sm:table-cell text-right align-middle text-xs">
        {leaguePoints}
      </div>
      <div className="hidden sm:table-cell text-right align-middle text-xs">
        {winrate ? winrate.toFixed(2) + '%' : ''}
      </div>
      <div className="hidden sm:table-cell text-right align-middle text-xs">
        {totalGames && totalGames > 0 ? totalGames : ''}
      </div>
      <div className="max-[360px]:hidden table-cell sm:hidden text-right align-middle text-xs">
        <div>
          {props.leagueAccount.tier === 'UNRANKED'
            ? ''
            : props.leagueAccount.tier}
          {rank ? ` ${rank}` : ''}
        </div>
        <div>{winrate ? winrate.toFixed(2) + '% WR' : ''}</div>
        <div>{totalGames ? totalGames + ' Games' : ''}</div>
      </div>
    </>
  );
}
