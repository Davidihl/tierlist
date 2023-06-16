import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { getAllLeagueAccounts } from '../../../database/leagueoflegends';
import { getAllPlayers, getPlayerById } from '../../../database/players';
import { getAllUsers } from '../../../database/users';

const typeDefs = gql`
  type Query {
    users: [User]
    players: [Player]
    player(id: ID!): Player
    leagueAccounts: [LeagueAccount]
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
    userId: User
    alias: String
    firstName: String
    lastName: String
    contact: String
    slug: String
    mainaccountId: LeagueAccount
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
    players: async () => {
      return await getAllPlayers();
    },
    leagueAccounts: async () => {
      return await getAllLeagueAccounts();
    },

    player: async (parent: null, args: { id: string }) => {
      console.log(args);
      const player = await getPlayerById(Number(args.id));
      console.log('const player:', player);
      return player;
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
