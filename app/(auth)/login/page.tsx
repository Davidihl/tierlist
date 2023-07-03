import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPlayerByUserId } from '../../../database/players';
import {
  getSlugFromToken,
  getValidSessionByToken,
} from '../../../database/sessions';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Sign in',
  description: 'Sign in to your personal account',
};

export default async function LoginPage() {
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
    <main className="flex justify-center sm:items-center sm:h-full sm:p-4">
      <div className="shadow-xl w-full sm:w-3/4 md:w-1/2 max-w-lg bg-base-100 border-primary sm:border-t-4">
        <div className="card-body">
          <h1 className="card-title">Login</h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
