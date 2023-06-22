import { cache } from 'react';
import { encodeString } from '../util/encodeString';
import { sql } from './connect';

export type Organisation = {
  id: number;
  userId: number;
  name: string;
  contact: string | null;
  slug: string;
};

export const getAllOrganisations = cache(async () => {
  const organisations = await sql<Organisation[]>`
    SELECT
      id,
      user_id,
      name,
      contact,
      slug
    FROM
      organisations
 `;
  return organisations;
});

export const getOrganisationById = cache(async (id: number) => {
  const [organisation] = await sql<Organisation[]>`
    SELECT
      id,
      user_id,
      name,
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
      name,
      contact,
      slug
    FROM
      organisations
    WHERE
      slug = ${encodeString(slug).toLowerCase()}
 `;
  return organisation;
});

export const getOrganisationByUserId = cache(async (id: number) => {
  const [organisation] = await sql<Organisation[]>`
    SELECT
      id,
      user_id,
      name,
      contact,
      slug
    FROM
      organisations
    WHERE
      user_id = ${id}
 `;
  return organisation;
});
