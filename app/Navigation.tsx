import Image from 'next/image';
import Link from 'next/link';
import LoginLink from '../components/LoginLink';
import Menu from '../components/Menu';
import esvoeLogo from '../public/esvoe_Logo.svg';

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
