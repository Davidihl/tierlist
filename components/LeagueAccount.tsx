import Image from 'next/image';
import { LeagueAccountQuery } from '../database/leagueAccounts';

type Props = {
  leagueAccount: LeagueAccountQuery;
};

export default function LeagueAccount(props: Props) {
  return (
    <div className="flex gap-2 items-center">
      <Image
        src={`/leagueoflegends/tiers/${props.leagueAccount.tier}.webp`}
        alt={`Tier ${props.leagueAccount.tier}`}
        width={50}
        height={50}
      />
      <div>{props.leagueAccount.summoner}</div>
      <div className="text-xs">{props.leagueAccount.lastUpdate.toString()}</div>
    </div>
  );
}
