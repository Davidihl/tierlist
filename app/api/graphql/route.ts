import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { getAllPlayers } from '../../../database/players';
import { getAllUsers, getUserByID } from '../../../database/users';

const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
    players: [Player]
    player(id: ID!): Player
  }

  type User {
    id: ID!
    username: String
    password_hash: String
    is_admin: Boolean
    is_player: Boolean
    created: String
    last_update: String
  }

  type Player {
    id: ID!
    user_id: User! # A player is always related to a user
    alias: String
    first_name: String
    last_name: String
    contact: String
    confirmed_residency: Boolean
    leagueoflegends_id: [Int] # Replace this with leagueoflegends schema type
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
