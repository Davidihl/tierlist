import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getLeagueAccountsByPlayerId } from '../../../database/leagueAccounts';
import { getPlayerBySlug } from '../../../database/players';
import { getValidSessionByToken } from '../../../database/sessions';
import AddLeagueAccount from './AddLeagueAccount';

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    slug: string;
  };
};

export default async function PlayerPage(props: Props) {
  const playerData = await getPlayerBySlug(props.params.slug);
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));
  const allowEdit = session?.userId === playerData?.userId;

  if (!playerData) {
    notFound();
  }
  const leagueData = await getLeagueAccountsByPlayerId(playerData.id);
  console.log(playerData);
  console.log(leagueData);
  console.log(allowEdit);
  return (
    <main className="p-4">
      <h1 className="font-medium text-xl">{playerData.alias}</h1>
      {playerData.firstName && playerData.lastName ? (
        <p>
          <span>{playerData.firstName}</span> <span>{playerData.lastName}</span>
        </p>
      ) : (
        ''
      )}
      {playerData.contact ? <p>Contact: {playerData.contact}</p> : ''}
      {allowEdit ? <AddLeagueAccount userId={playerData.userId} /> : ''}
    </main>
  );
}
