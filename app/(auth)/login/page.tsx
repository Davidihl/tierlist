import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getSlugFromToken,
  getValidSessionByToken,
} from '../../../database/sessions';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // 3. Either redirect or render the login form
  if (session) {
    const sessionData = await getValidSessionByToken(sessionTokenCookie.value);
    const user = await getSlugFromToken(sessionData!.userId);
    redirect(user.slug);
  }
  return <LoginForm />;
}
