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
  const users = await sql<User[]>`
    SELECT
    id,
    username,
    is_admin,
    created,
    last_update
    FROM
      users

 `;
  return users;
});

export async function getUserByID(id: number) {
  const [user] = await sql<User[]>`
    SELECT
    id,
    username,
    is_admin,
    created,
    last_update
    FROM
      users
    WHERE
      id = ${id}
 `;
  return user;
}
