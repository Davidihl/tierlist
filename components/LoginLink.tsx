import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { getPlayerByUserId } from '../database/players';
import { getSlugFromToken, getValidSessionByToken } from '../database/sessions';
import loginIcon from '../public/login.svg';
import logoutIcon from '../public/logout.svg';
import profileIcon from '../public/profile.svg';

export default async function LoginLink() {
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  if (session) {
    const sessionData = await getValidSessionByToken(sessionTokenCookie.value);
    const user = await getSlugFromToken(sessionData!.userId);
    const isPlayer = await getPlayerByUserId(Number(sessionData!.userId));

    return (
      <>
        <li>
          <Link
            href={`/${isPlayer ? 'players' : 'organisations'}/${user.slug}`}
            className="flex items-center gap-1"
          >
            My Profile
            <Image src={profileIcon} alt="Profile" />
          </Link>
        </li>
        <li>
          <Link href="/logout" className="flex items-center gap-1">
            Logout
            <Image src={logoutIcon} alt="Logout" />
          </Link>
        </li>
      </>
    );
  }

  return (
    <li>
      <Link href="/login" className="flex items-center gap-1">
        Login
        <Image src={loginIcon} alt="Login" />
      </Link>
    </li>
  );
}
