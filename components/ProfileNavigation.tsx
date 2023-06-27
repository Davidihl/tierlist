'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Player } from '../database/players';
import logoutIcon from '../public/logout.svg';
import profileIcon from '../public/profile.svg';

type Props = {
  isPlayer: Player | undefined;
  slug: string;
};

export default function ProfileNavigation(props: Props) {
  const [menu, setMenu] = useState(false);
  console.log(menu);

  return (
    // <>
    //   <button onClick={() => setMenu(!menu)}>
    //     <Image src={profileIcon} alt="Profile" />
    //   </button>
    //   {menu && (
    //     <>
    //       <li>
    //         <Link
    //           href={`/${props.isPlayer ? 'players' : 'organisations'}/${
    //             props.slug
    //           }`}
    //           className="flex items-center gap-1"
    //         >
    //           My Profile
    //           <Image src={profileIcon} alt="Profile" />
    //         </Link>
    //       </li>
    //       <li>
    //         <Link href="/logout" className="flex items-center gap-1">
    //           Logout
    //           <Image src={logoutIcon} alt="Logout" />
    //         </Link>
    //       </li>
    //     </>
    //   )}
    // </>

  );
}
