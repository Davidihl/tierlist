import Image from 'next/image';
import Link from 'next/link';
import esvoeLogo from '../public/esvoe_Logo.svg';
import LoginLink from './LoginLink';
import Menu from './Menu';

export default function Navigation() {
  return (
    <nav className="navbar bg-base-100 drop-shadow fixed top-0 z-40">
      <div className="flex-none">
        <Menu />
      </div>
      <div className="flex-1 mr-1">
        <Link href="/">
          <Image src={esvoeLogo} className="w-32" alt="ESVÖ Logo" />
        </Link>
      </div>
      <LoginLink />
    </nav>
  );
}
