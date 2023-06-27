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
      <li className="dropdown dropdown-end">
        <button className="flex items-center justify-center">
          <Image src={profileIcon} alt="Profile" />
        </button>
        <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          <li>
            <Link
              href={`/${isPlayer ? 'players' : 'organisations'}/${user.slug}`}
              className="flex items-center gap-1 justify-between"
            >
              <span>My Profile</span>
              <Image src={profileIcon} alt="Profile" />
            </Link>
          </li>
          <li>
            <Link
              href="/logout"
              className="flex items-center gap-1 justify-between"
            >
              <span>Logout</span>
              <Image src={logoutIcon} alt="Logout" />
            </Link>
          </li>
        </ul>
      </li>
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
