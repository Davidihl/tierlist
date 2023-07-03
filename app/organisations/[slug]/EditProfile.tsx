'use client';
import { useState } from 'react';

export default function EditProfile() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="btn btn-circle absolute right-4 top-4"
        onClick={() => setOpen(!open)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path d="M754.306-613.77 619.309-747.537l52.538-52.538q17.231-17.23 42.461-17.23 25.23 0 42.46 17.23l49.461 49.461q17.231 17.23 17.846 41.845.615 24.615-16.615 41.845l-53.154 53.154Zm-43.383 43.999-429.77 429.77H146.156v-134.998l429.769-429.77 134.998 134.998Z" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-0 left-0 right-0">
          <form className="shadow-xl w-full max-w-4xl bg-base-100 border-primary sm:border-t-4 p-4">
            <div className="flex justify-between items-center">
              <h2>Edit Profile</h2>
              <button
                className="btn btn-ghost btn-circle"
                onClick={() => setOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M256-213.847 213.847-256l224-224-224-224L256-746.153l224 224 224-224L746.153-704l-224 224 224 224L704-213.847l-224-224-224 224Z" />
                </svg>
              </button>
            </div>
            test
          </form>
        </div>
      )}
    </>
  );
}
