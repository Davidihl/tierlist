import { cache } from 'react';
import { sql } from './connect';

export type User = {
  id: number;
  username: string;
  isAdmin: boolean;
  isPlayer: boolean;
  created: Date;
  lastUpdate: Date;
};

export type UserWithPassword = User & {
  password_hash: string;
};

export const getAllUsers = cache(async () => {
  const products = await sql<User[]>`
    SELECT
    id,
    username,
    is_admin,
    is_player,
    created,
    last_update
    FROM
      users

 `;
  return products;
});

export function getUserByID() {
  return console.log('it works');
}
