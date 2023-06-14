export type Player = {
  id: number;
  user_id: number;
  alias: string;
  first_name: string;
  last_name: string;
  contact: string;
  confirmed_residency: boolean;
  leagueoflegends_id: Array<number> | null;
};

export const players = [
  {
    id: 1,
    user_id: 1,
    alias: 'Labetalol hydrochloride',
    first_name: 'Eugene',
    last_name: 'Canlin',
    contact: 'ecanlin0@ucsd.edu',
    confirmed_residency: false,
    leagueoflegends_id: null,
  },
];

export function getAllPlayers() {
  return players;
}
