import Image from 'next/image';
import Link from 'next/link';
import esvoeLogo from '../public/esvoe_Logo.svg';
import LoginLink from './LoginLink';

export default function Navigation() {
  return (
    <nav className="sticky top-0 left-0 right-0 w-full flex justify-between mb-4 drop-shadow">
      <div className="bg-white grow p-4 flex items-center">
        <Image src={esvoeLogo} className="w-48" alt="ESVÖ Logo" />
      </div>
      <div className="bg-white grow p-4 flex justify-end items-center">
        <ul>
          <li>
            <Link href="/players">Players</Link>
          </li>
          <li>
            <Link href="/organisations">Organisations</Link>
          </li>
          <LoginLink />
        </ul>
      </div>
    </nav>
  );
}
