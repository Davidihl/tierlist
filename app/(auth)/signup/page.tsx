import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPlayerByUserId } from '../../../database/players';
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
    const isPlayer = await getPlayerByUserId(Number(sessionData!.userId));
    redirect(`/${isPlayer ? 'players' : 'organisations'}/${user.slug}`);
  }
  return (
    <main className="p-4">
      <h1 className="text-3xl font-medium mb-4">Login</h1>
      <SignUpForm />
    </main>
  );
}
