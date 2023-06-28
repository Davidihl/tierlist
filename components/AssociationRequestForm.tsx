'use client';

import { useState } from 'react';

type Props = {
  isPlayer: boolean;
};

export default function AssociationRequestForm(props: Props) {
  const [alias, setAlias] = useState('');
  console.log(props.isPlayer);

  return (
    <form>
      <label>
        Alias
        <input
          value={alias}
          onChange={(event) => {
            setAlias(event.currentTarget.value);
          }}
          placeholder="Summoner"
          className="input input-bordered w-full max-w-xs block my-4"
        />
      </label>
      <button className="btn rounded-full">Ask</button>
    </form>
  );
}
