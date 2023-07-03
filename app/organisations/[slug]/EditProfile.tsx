'use client';
import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

declare global {
  interface Window {
    my_modal: any;
  }
}

export default function EditProfile() {
  return (
    <div className="absolute top-4 right-4">
      <button
        className="btn rounded-full"
        onClick={() => window.my_modal.showModal()}
      >
        Edit Profile
      </button>
      <dialog id="my_modal" className="modal">
        <form method="dialog" className="modal-box">
          <div>
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
            <h2 className="font-medium text-lg mb-2">Edit Profile:</h2>
          </div>
          <div>
            <label className="label-text">
              Username
              <input
                value=""
                placeholder="Username"
                className="mt-1 p-2 block input input-bordered w-full"
              />
            </label>
            <label className="label-text">
              Username
              <input
                value=""
                placeholder="Username"
                className="mt-1 p-2 block input input-bordered w-full"
              />
            </label>
            <label className="label-text">
              Username
              <input
                value=""
                placeholder="Username"
                className="mt-1 p-2 block input input-bordered w-full"
              />
            </label>
            <label className="label-text">
              Username
              <input
                value=""
                placeholder="Username"
                className="mt-1 p-2 block input input-bordered w-full"
              />
            </label>
            <label className="label-text">
              Username
              <input
                value=""
                placeholder="Username"
                className="mt-1 p-2 block input input-bordered w-full"
              />
            </label>
            <label className="label-text">
              Username
              <input
                value=""
                placeholder="Username"
                className="mt-1 p-2 block input input-bordered w-full"
              />
            </label>
            <label className="label-text">
              Username
              <input
                value=""
                placeholder="Username"
                className="mt-1 p-2 block input input-bordered w-full"
              />
            </label>
            <label className="label-text">
              Username
              <input
                value=""
                placeholder="Username"
                className="mt-1 p-2 block input input-bordered w-full"
              />
            </label>
            <label className="label-text">
              Username
              <input
                value=""
                placeholder="Username"
                className="mt-1 p-2 block input input-bordered w-full"
              />
            </label>
          </div>
        </form>
      </dialog>
    </div>
  );
}
