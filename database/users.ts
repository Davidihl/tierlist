import { cache } from 'react';
import { sql } from './connect';

export type User = {
  id: number;
  username: string;
  isAdmin: boolean;
  created: Date;
  lastUpdate: Date;
};

export type UserWithPassword = User & {
  passwordHash: string;
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

export const getUserByID = cache(async (id: number) => {
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
});

export const getUserByUsername = cache(async (username: string) => {
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
      username = ${username.toLowerCase()}
 `;
  return user;
});

export const getUserWithPasswordHash = cache(async (username: string) => {
  const [user] = await sql<UserWithPassword[]>`
    SELECT
      *
    FROM
      users
    WHERE
      username = ${username.toLowerCase()}
 `;
  return user;
});

export const createUser = cache(
  async (username: string, passwordHash: string) => {
    const [user] = await sql<User[]>`
    INSERT INTO users
      (username, password_hash)
    VALUES
      (${username.toLowerCase()}, ${passwordHash})
    RETURNING
      id,
      username,
      is_admin,
      created,
      last_update
 `;
    return user;
  },
);
