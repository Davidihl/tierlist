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
    <main className="flex justify-center sm:items-center sm:h-full sm:p-4">
      <div className="shadow-xl w-full sm:w-3/4 md:w-1/2 max-w-lg bg-base-100 border-primary sm:border-t-4">
        <div className="card-body">
          <h1 className="text-3xl font-medium mb-4">Logout</h1>
          <LogOutForm token={sessionTokenCookie.value} />
        </div>
      </div>
    </main>
  );
}
