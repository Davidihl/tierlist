import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPlayerById } from '../../../database/players';
import {
  getSlugFromToken,
  getValidSessionByToken,
} from '../../../database/sessions';
import SignUpForm from './SignUpForm';

export default async function SignUpPage() {
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // 3. Either redirect or render the login form
  if (session) {
    const sessionData = await getValidSessionByToken(sessionTokenCookie.value);
    const user = await getSlugFromToken(sessionData!.userId);
    const isPlayer = await getPlayerById(Number(sessionData!.userId));
    redirect(`/${isPlayer ? 'players' : 'organisations'}/${user.slug}`);
  }
  return <SignUpForm />;
}
