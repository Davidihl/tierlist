import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { getPlayerByUserId } from '../database/players';
import { getSlugFromToken, getValidSessionByToken } from '../database/sessions';
import loginIcon from '../public/login.svg';
import ProfileMenu from './ProfileMenu';

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
      <div>
        <ProfileMenu slug={user.slug} isPlayer={isPlayer} />
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
