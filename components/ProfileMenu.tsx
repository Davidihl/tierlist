'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { Player } from '../database/players';
import logoutIcon from '../public/logout.svg';
import profileIcon from '../public/profile.svg';

type Props = {
  slug: string;
  isPlayer: Player | undefined;
};

export default function ProfileMenu(props: Props) {
  const [show, setShow] = useState(false);

  const ref = useRef(null);

  const handleClickOutside = () => {
    setShow(false);
  };

  const handleClickInside = () => {
    setShow(!show);
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <>
      <button
        className="flex items-center justify-center"
        onClick={() => handleClickInside()}
        ref={ref}
      >
        <Image src={profileIcon} alt="Profile" />
      </button>
      <ul
        className={`${
          show ? '' : 'hidden'
        } absolute right-0 mr-3 mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52`}
      >
        <li>
          <Link
            href={`/${props.isPlayer ? 'players' : 'organisations'}/${
              props.slug
            }`}
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
    </>
  );
}
