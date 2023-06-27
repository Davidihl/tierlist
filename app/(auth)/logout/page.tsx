import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSessionByToken } from '../../../database/sessions';
import LogOutForm from './LogOutForm';

export const metadata = {
  title: 'Logout',
  description: 'Logout of your ESVÖ playerdatabase account',
};

export default async function LogoutPage() {
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // 3. Either redirect or render the login form
  if (!session) redirect('/');
  return (
    <main className="p-4">
      <h1 className="text-3xl font-medium mb-4">Logout</h1>
      <LogOutForm token={sessionTokenCookie.value} />
    </main>
  );
}
