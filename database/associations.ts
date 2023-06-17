import { cache } from 'react';
import { sql } from './connect';

export type Association = {
  id: number;
  playerId: number;
  organisationId: number;
  startDate: Date | null;
  endDate: Date | null;
};

export const getAllAssociations = cache(async () => {
  const associations = await sql<Association[]>`
    SELECT
    id,
    player_id,
    organisation_id,
    start_date,
    end_date
    FROM
      associations
    WHERE
      end_date IS NULL;

 `;
  return associations;
});

export const getAssociationsByPlayer = cache(async (id: number) => {
  const [associations] = await sql<Association[]>`
    SELECT
    id,
    player_id,
    organisation_id,
    start_date,
    end_date
    FROM
      associations
    WHERE
      player_id = ${id} AND
      end_date IS NULL;

 `;
  return associations;
});

export const getAssociationsByOrganisation = cache(async (id: number) => {
  const associations = await sql<Association[]>`
    SELECT
    id,
    player_id,
    organisation_id,
    start_date,
    end_date
    FROM
      associations
    WHERE
      organisation_id = ${id} AND
      end_date IS NULL
 `;
  return associations;
});

export const getPendingAssociations = cache(async (id: number) => {
  const associations = await sql<Association[]>`
    SELECT
    id,
    player_id,
    organisation_id,
    start_date,
    end_date
    FROM
      associations
    WHERE
      player_id = ${id} AND
      start_date IS NULL AND
      end_date IS NULL
 `;
  return associations;
});
