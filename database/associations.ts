import { cache } from 'react';
import { sql } from './connect';

export type Association = {
  id: number;
  playerId: number;
  organisationId: number;
  playerRequest: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

export const getAllAssociations = cache(async () => {
  const associations = await sql<Association[]>`
    SELECT
      *
    FROM
      associations
    WHERE
      start_date IS NOT NULL AND
      end_date IS NULL
 `;
  return associations;
});

export const getAssocationById = cache(async (id: number) => {
  const [associations] = await sql<Association[]>`
    SELECT
      *
    FROM
      associations
    WHERE
      id = ${id}

 `;
  return associations;
});

export const getAssociationsByPlayer = cache(async (id: number) => {
  const [associations] = await sql<Association[]>`
    SELECT
      *
    FROM
      associations
    WHERE
      player_id = ${id} AND
      end_date IS NULL

 `;
  return associations;
});

export const getCurrentAssociationsByPlayer = cache(async (id: number) => {
  const [associations] = await sql<Association[]>`
    SELECT
      *
    FROM
      associations
    WHERE
      start_date IS NOT NULL AND
      player_id = ${id} AND
      end_date IS NULL

 `;
  return associations;
});

export const getAssociationsByOrganisation = cache(async (id: number) => {
  const associations = await sql<Association[]>`
    SELECT
      *
    FROM
      associations
    WHERE
      start_date IS NOT NULL AND
      organisation_id = ${id} AND
      end_date IS NULL

 `;
  return associations;
});

export const getPendingAssociationsByPlayer = cache(async (id: number) => {
  const associations = await sql<Association[]>`
    SELECT
      *
    FROM
      associations
    WHERE
      player_id = ${id} AND
      start_date IS NULL AND
      end_date IS NULL

 `;
  return associations;
});

export const getPendingAssociationsByOrganisation = cache(
  async (id: number) => {
    const associations = await sql<Association[]>`
    SELECT
      *
    FROM
      associations
    WHERE
      organisation_id = ${id} AND
      start_date IS NULL AND
      end_date IS NULL
 `;
    return associations;
  },
);

export const requestAssociation = cache(
  async (
    playerId: number,
    organisationId: number,
    playerRequest: boolean = false,
  ) => {
    const [association] = await sql<Association[]>`
    INSERT INTO associations
      (player_id,organisation_id,player_request)
    VALUES
      (${playerId},
      ${organisationId},
      ${playerRequest})
    RETURNING
      *
    `;
    return association;
  },
);

export const acceptAssociationRequest = cache(async (id: number) => {
  const [association] = await sql<Association[]>`
  UPDATE
    associations
  SET
    start_date = now()
  WHERE
    id=${id}
  RETURNING
    *
  `;

  return association;
});

export const endAssociation = cache(async (id: number) => {
  const [association] = await sql<Association[]>`
  UPDATE
    associations
  SET
    end_date = now()
  WHERE
    id=${id}
  RETURNING
    *
  `;

  return association;
});

export const deleteAssociationsByOrganisationId = cache(
  async (organisationId: number) => {
    const associations = await sql<Association[]>`
  DELETE FROM
    associations
  WHERE
    organisation_id = ${organisationId}
  RETURNING
    *
  `;

    return associations;
  },
);

export const deleteAssociationByPlayerId = cache(async (playerId: number) => {
  const associations = await sql<Association[]>`
  DELETE FROM
    associations
  WHERE
    player_id = ${playerId}
  RETURNING
    *
  `;

  return associations;
});
