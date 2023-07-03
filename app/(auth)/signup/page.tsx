import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPlayerByUserId } from '../../../database/players';
import {
  getSlugFromToken,
  getValidSessionByToken,
} from '../../../database/sessions';
import SignUpForm from './SignUpForm';

export const metadata = {
  title: 'Sign up',
  description: 'Create your own account as a player or organisation',
};

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
    <main className="flex justify-center sm:items-center sm:p-4">
      <div className="shadow-xl w-full sm:w-3/4 md:w-2/3 max-w-lg bg-base-100 border-primary sm:border-t-4">
        <div className="card-body">
          <h1 className="text-3xl font-medium mb-4">Sign up</h1>
          <SignUpForm />
        </div>
      </div>
    </main>
  );
}
