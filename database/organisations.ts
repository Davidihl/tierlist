import { cache } from 'react';
import { encodeString } from '../util/encodeString';
import { sql } from './connect';

export type Organisation = {
  id: number;
  userId: number;
  alias: string;
  contact: string | null;
  slug: string;
};

export const getAllOrganisations = cache(async () => {
  const organisations = await sql<Organisation[]>`
    SELECT
      id,
      user_id,
      alias,
      contact,
      slug
    FROM
      organisations
    ORDER BY
      alias ASC
 `;
  return organisations;
});

export const getOrganisationById = cache(async (id: number) => {
  const [organisation] = await sql<Organisation[]>`
    SELECT
      id,
      user_id,
      alias,
      contact,
      slug
    FROM
      organisations
    WHERE
      id = ${id}
 `;
  return organisation;
});

export const getOrganisationBySlug = cache(async (slug: string) => {
  const [organisation] = await sql<Organisation[]>`
    SELECT
      id,
      user_id,
      alias,
      contact,
      slug
    FROM
      organisations
    WHERE
      slug = ${slug}
 `;
  return organisation;
});

export const getOrganisationByAlias = cache(async (alias: string) => {
  const [organisation] = await sql<Organisation[]>`
    SELECT
      id,
      user_id,
      alias,
      contact,
      slug
    FROM
      organisations
    WHERE
      alias = ${alias}
 `;
  return organisation;
});

export const getOrganisationByUserId = cache(async (id: number) => {
  const [organisation] = await sql<Organisation[]>`
    SELECT
      id,
      user_id,
      alias,
      contact,
      slug
    FROM
      organisations
    WHERE
      user_id = ${id}
 `;
  return organisation;
});

export const createOrganisation = cache(
  async (userId: number, alias: string, contact: string | null) => {
    const [organisation] = await sql<Organisation[]>`
    INSERT INTO organisations
    (user_id, alias, contact, slug)
  VALUES
    (${userId}, ${alias}, ${contact}, ${encodeString(alias).toLowerCase()})
  RETURNING
  *`;

    return organisation;
  },
);

export const updateOrganisation = cache(
  async (organisationId: number, alias: string, contact: string) => {
    const [organisation] = await sql<Organisation[]>`
    UPDATE
      organisations
    SET
      alias = ${alias}, contact = ${contact}, slug = ${encodeString(
      alias,
    ).toLowerCase()}
    WHERE
        id = ${organisationId}
  RETURNING
  *`;

    return organisation;
  },
);

export const deleteOrganisationByOrganisationId = cache(
  async (organisationId: number) => {
    const [organisation] = await sql<Organisation[]>`
  DELETE FROM
    organisations
  WHERE
    id = ${organisationId}
  RETURNING
  *
  `;

    return organisation;
  },
);
