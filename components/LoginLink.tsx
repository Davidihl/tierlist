import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { getPlayerByUserId } from '../database/players';
import { getSlugFromToken, getValidSessionByToken } from '../database/sessions';
import { getUserByToken } from '../database/users';
import loginIcon from '../public/login.svg';
import ProfileMenu from './ProfileMenu';

export default async function LoginLink() {
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  if (session) {
    const sessionData = await getValidSessionByToken(sessionTokenCookie.value);
    const userSlug = await getSlugFromToken(sessionData!.userId);
    const isPlayer = await getPlayerByUserId(Number(sessionData!.userId));
    const user = await getUserByToken(sessionTokenCookie.value);

    return (
      <div>
        <ProfileMenu
          slug={userSlug.slug}
          isPlayer={isPlayer}
          username={user!.username}
        />
      </div>
    );
  }

  return (
    <div>
      <Link href="/login" className="flex items-center gap-1">
        Login
        <Image src={loginIcon} alt="Login" />
      </Link>
    </div>
  );
}
