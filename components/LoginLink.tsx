import { cookies } from 'next/headers';
import Link from 'next/link';
import { getValidSessionByToken } from '../database/sessions';

export default async function LoginLink() {
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  if (session) {
    return (
      <>
        <li>
          <Link href="/">My Profile</Link>
        </li>
        <li>
          <Link href="/logout">Logout</Link>
        </li>
      </>
    );
  }

  return (
    <li>
      <Link href="/login">Login</Link>
    </li>
  );
}
