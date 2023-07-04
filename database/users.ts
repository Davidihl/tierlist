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

export const getUserById = cache(async (id: number) => {
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
      username = ${username}
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
      username = ${username}
 `;
  return user;
});

export const getUserWithPasswordHashByUserId = cache(async (id: number) => {
  const [user] = await sql<UserWithPassword[]>`
    SELECT
      *
    FROM
      users
    WHERE
      id = ${id}
 `;
  return user;
});

export const getUserByToken = cache(async (token: string) => {
  const [user] = await sql<User[]>`
  SELECT
  users.id,
  users.username,
  users.is_admin,
  users.created,
  users.last_update
  FROM
    users
    INNER JOIN
    sessions ON (
      sessions.token = ${token} AND
      sessions.user_id = users.id AND
      sessions.expiry_timestamp > now()
    )
  `;
  return user;
});

export const createUser = cache(
  async (username: string, passwordHash: string) => {
    const [user] = await sql<User[]>`
    INSERT INTO users
      (username, password_hash)
    VALUES
      (${username}, ${passwordHash})
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

export const updateUsername = async (username: string, userId: number) => {
  const [user] = await sql<User[]>`
    UPDATE
      users
    SET
      username = ${username}
    WHERE
      id = ${userId}
    RETURNING
      id,
      username,
      is_admin,
      created,
      last_update
 `;
  return user;
};

export const updateUserWithPassword = async (
  username: string,
  passwordHash: string,
  userId: number,
) => {
  const [user] = await sql<User[]>`
    UPDATE
      users
    SET
      username = ${username},
      password_hash =${passwordHash}
    WHERE
      id = ${userId}
    RETURNING
      id,
      username,
      is_admin,
      created,
      last_update
 `;
  return user;
};

export const deleteUserByUserId = cache(async (userId: number) => {
  const [organisation] = await sql<User[]>`
  DELETE FROM
    users
  WHERE
    id = ${userId}
  RETURNING
    id,
    username,
    is_admin,
    created,
    last_update
  `;

  return organisation;
});
