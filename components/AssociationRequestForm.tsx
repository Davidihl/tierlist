'use client';

import { useState } from 'react';

type Props = {
  isPlayer: boolean;
};

export default function AssociationRequestForm(props: Props) {
  const [alias, setAlias] = useState('');

  return (
    <form className="mt-4 bg-slate-200 p-4 rounded">
      <h2 className="font-medium text-lg">
        {props.isPlayer
          ? 'Request association with organisation'
          : 'Request association with player'}
      </h2>
      <label className="text-sm ">
        Alias
        <input
          value={alias}
          onChange={(event) => {
            setAlias(event.currentTarget.value);
          }}
          placeholder="Alias"
          className="input input-bordered w-full max-w-xs block mb-4"
        />
      </label>
      <button
        className="btn btn-secondary rounded-full w-32"
        formAction={() => console.log('click')}
      >
        Ask
      </button>
    </form>
  );
}
