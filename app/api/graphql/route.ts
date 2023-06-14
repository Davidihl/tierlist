import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { getAllPlayers } from '../../../database/players';
import { getAllUsers } from '../../../database/users';

const typeDefs = gql`
  type Query {
    users: [User]
  }

  type User {
    id: ID!
    username: String
    isAdmin: Boolean
    created: String
    lastUpdate: String
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      return await getAllUsers();
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
