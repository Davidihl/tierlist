import { cache } from 'react';
import { sql } from './connect';

export type Organisation = {
  id: number;
  userId: number;
  name: string;
  contact: string;
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
