export type User = {
  id: number;
  password: string;
  is_admin: boolean;
  is_player: boolean;
  created: string;
  last_update: string;
};

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

export const user = [
  {
    id: 1,
    username: 'callcott0',
    password: '$2a$04$Ow4g6MF3PuSLreeRlJ0OyeTTst.XTDIAxxQ8opIGSkORNj/BI0Yn6',
    is_admin: false,
    is_player: true,
    created: '8/19/2022',
    last_update: '9/9/2022',
  },
  {
    id: 2,
    username: 'ltyrrell1',
    password: '$2a$04$vSpNtI2BtH9EqXj8dAdoc.4me7wswHV7DvQ4SjpC3k8v99xIT6Lvq',
    is_admin: true,
    is_player: false,
    created: '5/25/2023',
    last_update: '1/17/2023',
  },
  {
    id: 3,
    username: 'mmcguigan2',
    password: '$2a$04$X/SK/DewVmDBSjdynh.IxuR9wAnV9MCavpokCNoN6YDu2.G5tBI5K',
    is_admin: true,
    is_player: false,
    created: '11/11/2022',
    last_update: '2/6/2023',
  },
  {
    id: 4,
    username: 'jwiskar3',
    password: '$2a$04$zSvEL5zz3xukPIgxOjMjPu6mx.Vt35p1TBtXqgiOy2VdiGO5wbNLq',
    is_admin: false,
    is_player: false,
    created: '8/13/2022',
    last_update: '3/3/2023',
  },
  {
    id: 5,
    username: 'kbonnyson4',
    password: '$2a$04$1HP9bLatCGKoOcjAInqz8e8Frw225t.oI1u5iPxYCffraSAjg9n.S',
    is_admin: true,
    is_player: false,
    created: '5/29/2023',
    last_update: '3/12/2023',
  },
  {
    id: 6,
    username: 'mmcilwaine5',
    password: '$2a$04$iUgxtSgS..ShIySi6C8KL.r3RkuQibrxUVHj9LA2nXRT9pY2BvkN2',
    is_admin: false,
    is_player: true,
    created: '10/6/2022',
    last_update: '8/26/2022',
  },
  {
    id: 7,
    username: 'sgridley6',
    password: '$2a$04$0eNAckrLMaWMqtoUTCw88.dhXAbucudDrtuhmfGsSKoBJl5jNN0ry',
    is_admin: true,
    is_player: false,
    created: '4/15/2023',
    last_update: '2/22/2023',
  },
  {
    id: 8,
    username: 'mrodrigo7',
    password: '$2a$04$TyKlqR1d4kp9yGOk1XCx6O5JhPwGmZm0YN.nBtvwbiB6DaNRzwyum',
    is_admin: false,
    is_player: true,
    created: '9/12/2022',
    last_update: '12/8/2022',
  },
  {
    id: 9,
    username: 'agiral8',
    password: '$2a$04$syLwppuySeNdaUNaicOnQOecyuKV05RW6hxDYVuXw4Wg6h.jMZpRO',
    is_admin: true,
    is_player: false,
    created: '4/24/2023',
    last_update: '12/5/2022',
  },
  {
    id: 10,
    username: 'mkarpushkin9',
    password: '$2a$04$MDjVVZIasjH.HviW2jOu3.D9JSwVeFxWKLc/dbVadichvL2mG0Zs.',
    is_admin: false,
    is_player: false,
    created: '11/27/2022',
    last_update: '9/14/2022',
  },
];

export const player = [
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
  {
    id: 2,
    user_id: 2,
    alias: 'Fluvoxamine Maleate',
    first_name: 'Tomkin',
    last_name: 'Horney',
    contact: 'thorney1@blogtalkradio.com',
    confirmed_residency: false,
    leagueoflegends_id: null,
  },
  {
    id: 3,
    user_id: 3,
    alias: 'Asthmanefrin',
    first_name: 'Joshia',
    last_name: 'Antat',
    contact: 'jantat2@plala.or.jp',
    confirmed_residency: true,
    leagueoflegends_id: null,
  },
  {
    id: 4,
    user_id: 4,
    alias: 'Nitrofurantoin Macrocrystals',
    first_name: 'Ruben',
    last_name: 'Littlechild',
    contact: 'rlittlechild3@si.edu',
    confirmed_residency: false,
    leagueoflegends_id: null,
  },
  {
    id: 5,
    user_id: 5,
    alias: 'HAND SANITIZER',
    first_name: 'Keriann',
    last_name: 'Bodycomb',
    contact: 'kbodycomb4@fc2.com',
    confirmed_residency: true,
    leagueoflegends_id: null,
  },
  {
    id: 6,
    user_id: 6,
    alias: 'Soothix Acne Treatment and Blemish Prevention Formula',
    first_name: 'Brynna',
    last_name: 'Onians',
    contact: 'bonians5@multiply.com',
    confirmed_residency: false,
    leagueoflegends_id: null,
  },
  {
    id: 7,
    user_id: 7,
    alias: 'Clindamycin Hydrochloride',
    first_name: 'Lesley',
    last_name: 'Dwight',
    contact: 'ldwight6@sciencedirect.com',
    confirmed_residency: false,
    leagueoflegends_id: null,
  },
  {
    id: 8,
    user_id: 8,
    alias: 'Levofloxacin',
    first_name: 'Natala',
    last_name: 'Loblie',
    contact: 'nloblie7@indiegogo.com',
    confirmed_residency: false,
    leagueoflegends_id: null,
  },
  {
    id: 9,
    user_id: 9,
    alias: 'Aspirin',
    first_name: 'Clayson',
    last_name: 'Felgate',
    contact: 'cfelgate8@clickbank.net',
    confirmed_residency: false,
    leagueoflegends_id: null,
  },
  {
    id: 10,
    user_id: 10,
    alias: 'Bisoprolol Fumarate and Hydrochlorothiazide',
    first_name: 'Sollie',
    last_name: 'Muddicliffe',
    contact: 'smuddicliffe9@google.fr',
    confirmed_residency: false,
    leagueoflegends_id: null,
  },
];
