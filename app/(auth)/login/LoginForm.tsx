'use client';

import { useState } from 'react';
import { login } from './actions';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form>
      <label>
        Username
        <input
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
          placeholder="Username"
          className="p-2 block"
        />
      </label>
      <label>
        Password
        <input
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          type="password"
          placeholder="Password"
          className="p-2 block"
        />
      </label>
      <div className="flex gap-4 items-center">
        <button
          formAction={() => login(username, password)}
          className="btn btn-primary rounded-full"
        >
          <span className="loading loading-spinner loading-sm" />
          Login
        </button>
        <button
          formAction={() => login}
          className="btn btn-secondary rounded-full group"
        >
          <span className="w-0 group-hover:loading loading-spinner group-hover:loading-sm transition-all" />
          Sign up
        </button>
      </div>
    </form>
  );
}
