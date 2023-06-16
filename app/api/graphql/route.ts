import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import {
  getAllLeagueAccounts,
  getLeagueAccountById,
} from '../../../database/leagueAccounts';
import {
  getAllPlayers,
  getPlayerById,
  Player,
} from '../../../database/players';
import { getAllUsers, getUserByID } from '../../../database/users';

const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
    players: [Player]
    player(id: ID!): Player
    playerMainAccount: LeagueAccount
    leagueAccounts: [LeagueAccount]
    leagueAccount(id: ID!): LeagueAccount
  }

  type User {
    id: ID!
    username: String
    isAdmin: Boolean
    created: String
    lastUpdate: String
  }

  type Player {
    id: ID!
    user: User
    alias: String
    firstName: String
    lastName: String
    contact: String
    slug: String
    mainAccount: LeagueAccount
  }

  type LeagueAccount {
    id: ID!
    player: Player
    name: String
    tier: String
    rank: String
    leaguePoints: String
    wins: Int
    losses: Int
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      return await getAllUsers();
    },
    user: async (parent: null, args: { id: string }) => {
      const user = await getUserByID(Number(args.id));
      return user;
    },
    players: async () => {
      return await getAllPlayers();
    },
    player: async (parent: null, args: { id: string }) => {
      const player = await getPlayerById(Number(args.id));
      return player;
    },
    leagueAccounts: async () => {
      return await getAllLeagueAccounts();
    },
    leagueAccount: async (parent: null, args: { id: string }) => {
      const account = await getLeagueAccountById(Number(args.id));
      return account;
    },
  },
  Player: {
    user: async (parent: any) => {
      return await getUserByID(Number(parent.userId));
    },
    mainAccount: async (parent: any) => {
      return await getLeagueAccountById(Number(parent.mainaccountId));
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context: async (req) => {
    return await { req };
  },
});

export async function GET(req: NextRequest) {
  return await handler(req);
}

export async function POST(req: NextRequest) {
  return await handler(req);
}
