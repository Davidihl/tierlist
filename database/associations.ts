import { cache } from 'react';
import { sql } from './connect';

export type Association = {
  id: number;
  playerId: number;
  organisationId: number;
  startDate: Date | null;
  endDate: Date | null;
};
