export type User = {
  id: number;
  password_hash: string;
  is_admin: boolean;
  is_player: boolean;
  created: string;
  last_update: string;
};

export const users = [
  {
    id: 1,
    username: 'callcott0',
    password_hash:
      '$2a$04$Ow4g6MF3PuSLreeRlJ0OyeTTst.XTDIAxxQ8opIGSkORNj/BI0Yn6',
    is_admin: false,
    is_player: true,
    created: '8/19/2022',
    last_update: '9/9/2022',
  },
];

export function getAllUsers() {
  return users;
}

export function getUserByID() {
  return console.log('it works');
}
