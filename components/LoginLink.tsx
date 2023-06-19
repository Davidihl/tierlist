import { cookies } from 'next/headers';
import Link from 'next/link';
import { getValidSessionByToken } from '../database/sessions';

export default async function LoginLink() {
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  if (session) return <Link href="/logout">Logout</Link>;

  return <Link href="/login">Login</Link>;
}
