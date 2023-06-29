'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export default function Menu() {
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
    <button
      className="mr-1 normal-case font-normal relative "
      onClick={() => handleClickInside()}
      ref={ref}
    >
      <span className="btn btn-square btn-ghost rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-5 h-5 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </span>
      <ul
        className={`${
          show ? '' : 'hidden'
        } absolute -left-2  top-14 w-screen flex bg-white p-4 items-center
        } transition-all`}
      >
        <li className="flex flex-col w-full lg:flex-row">
          <div className="grid flex-grow h-32 card rounded-box place-items-center">
            <Link
              href="/players"
              className="flex items-center gap-4 justify-between btn btn-ghost rounded-full normal-case font-normal"
            >
              <span className="font">Browser players</span>
            </Link>
          </div>
          <div className="divider lg:divider-horizontal">OR</div>
          <div className="grid flex-grow h-32 card rounded-box place-items-center">
            <Link
              href="/organisations"
              className="flex items-center gap-1 justify-between btn btn-ghost rounded-full normal-case font-normal"
            >
              <span>Browser organisations</span>
            </Link>
          </div>
        </li>
      </ul>
    </button>
  );
}
