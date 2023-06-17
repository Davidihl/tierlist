import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import {
  getAllAssociations,
  getAssociationsByOrganisation,
  getAssociationsByPlayer,
  getPendingAssociations,
} from '../../../database/associations';
import {
  getAllLeagueAccounts,
  getLeagueAccountById,
  getLeagueAccountsByPlayerId,
} from '../../../database/leagueAccounts';
import {
  getAllOrganisations,
  getOrganisationById,
} from '../../../database/organisations';
import {
  getAllPlayers,
  getPlayerById,
  Player,
} from '../../../database/players';
import { getAllUsers, getUserByID } from '../../../database/users';

const typeDefs = gql`
  type Query {
    # Get all users
    users: [User]

    # Get user data with certain id (no password information)
    user(id: ID!): User

    # Get all players
    players: [Player]

    # Get player data with certain id
    player(id: ID!): Player

    # Get all league accounts of a player
    playerLeagueAccounts(id: ID!): [PlayerLeagueAccount]

    # Get the association of a player
    playerAssociations(id: ID!): Association

    # Get associations of a player that have not been accepted yet
    playersAssociationsPending(id: ID!): [Association]

    # Get all league accounts
    leagueAccounts: [LeagueAccount]

    # Get league account data with certain id
    leagueAccount(id: ID!): LeagueAccount

    # Get all associations
    associations: [Association]

    # Get all organisations
    organisations: [Organisation]

    # Get a single organisation with a certain id
    organisation(id: ID!): Organisation

    # Get the associations of an organisation
    organisationAssociations(id: ID!): [Association]
  }

  scalar Date

  type User {
    id: ID!
    username: String
    isAdmin: Boolean
    created: Date
    lastUpdate: Date
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
    leagueAccounts: [PlayerLeagueAccount]
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
    lastUpdate: Date
  }

  type PlayerLeagueAccount {
    id: ID!
    player: Player
    name: String
    tier: String
    rank: String
    leaguePoints: String
    wins: Int
    losses: Int
    lastUpdate: Date
    isMainAccount: Boolean
  }

  type Organisation {
    id: ID!
    name: String
    contact: String
    slug: String
    user: User!
  }

  type Association {
    id: ID!
    player: Player
    organisation: Organisation
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      return await getAllUsers();
    },
    user: async (parent: null, args: { id: string }) => {
      return await getUserByID(Number(args.id));
    },
    players: async () => {
      return await getAllPlayers();
    },
    player: async (parent: null, args: { id: string }) => {
      return await getPlayerById(Number(args.id));
    },
    playerAssociations: async (parent: null, args: { id: string }) => {
      return await getAssociationsByPlayer(Number(args.id));
    },
    playersAssociationsPending: async (parent: null, args: { id: string }) => {
      return await getPendingAssociations(Number(args.id));
    },
    leagueAccounts: async () => {
      return await getAllLeagueAccounts();
    },
    leagueAccount: async (parent: null, args: { id: string }) => {
      return await getLeagueAccountById(Number(args.id));
    },
    associations: async () => {
      return await getAllAssociations();
    },
    organisations: async () => {
      return await getAllOrganisations();
    },
    organisationAssociations: async (parent: null, args: { id: string }) => {
      return await getAssociationsByOrganisation(Number(args.id));
    },
  },

  Date: {
    // The `serialize` function is used to convert the Date object to a string when sending the response
    serialize(value: Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      const hours = String(value.getHours()).padStart(2, '0');
      const minutes = String(value.getMinutes()).padStart(2, '0');
      const seconds = String(value.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
  },
  Player: {
    user: async (parent: any) => {
      return await getUserByID(Number(parent.userId));
    },
    mainAccount: async (parent: any) => {
      return await getLeagueAccountById(Number(parent.mainaccountId));
    },
    leagueAccounts: async (parent: any) => {
      return await getLeagueAccountsByPlayerId(parent.id);
    },
  },
  Association: {
    player: async (parent: any) => {
      return await getPlayerById(Number(parent.playerId));
    },
    organisation: async (parent: any) => {
      return await getOrganisationById(parent.organisationId);
    },
  },
  Organisation: {
    user: async (parent: any) => {
      return await getUserByID(Number(parent.userId));
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
