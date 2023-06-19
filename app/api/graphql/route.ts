import crypto from 'node:crypto';
import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { z } from 'zod';
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
import { createSession } from '../../../database/sessions';
import {
  createUser,
  getAllUsers,
  getUserByID,
  getUserByUsername,
  getUserWithPasswordHash,
} from '../../../database/users';

const typeDefs = gql`
  type Query {
    "Get all users"
    users: [User]

    "Get user data with certain id (no password information)"
    user(id: ID!): User

    "Get all players"
    players: [Player]

    "Get player data with certain id"
    player(id: ID!): Player

    "Get all league accounts of a player"
    playerLeagueAccounts(id: ID!): [PlayerLeagueAccount]

    "Get the association of a player"
    playerAssociations(id: ID!): Association

    "Get associations of a player that have not been accepted yet"
    playersAssociationsPending(id: ID!): [Association]

    "Get all league accounts"
    leagueAccounts: [LeagueAccount]

    "Get league account data with certain id"
    leagueAccount(id: ID!): LeagueAccount

    "Get all associations"
    associations: [Association]

    "Get all organisations"
    organisations: [Organisation]

    "Get a single organisation with a certain id"
    organisation(id: ID!): Organisation

    "Get the associations of an organisation"
    organisationAssociations(id: ID!): [Association]

    "Fetch league account data from riot api"
    riotGetLeagueAccount(summoner: String!): LeagueAccount
  }

  type Mutation {
    "Create a new user"
    createUser(username: String, password: String): User
    "Add a new league account to a player"
    addLeagueAccount(username: String): LeagueAccount
    "Login to a dedicated user which is related to either a player or an organisation"
    login(username: String!, password: String!): User
  }

  "Used to show timestamps YYYY-MM-DD hh:mm:ss"
  scalar Date

  "User containing credentials"
  type User {
    id: ID!
    username: String
    isAdmin: Boolean
    created: Date
    lastUpdate: Date
  }

  "Extension to a user, contains contact information and league of legends account details"
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

  "Due to rate limiter of RIOT api, league account data are cached in database"
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

  "Displaying all league accounts of a player including a field that marks the main account"
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

  "If a user is not a player, he is an organisation"
  type Organisation {
    id: ID!
    name: String
    contact: String
    slug: String
    user: User!
  }

  "Organisations can suggest an association to a player, but it has to be accepted by the player before it is valid. Both sides can end an association at any time"
  type Association {
    id: ID!
    player: Player
    organisation: Organisation
  }
`;

const resolvers = {
  // GraphQl Query Resolver
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

  // GraphQl Mutation Resolver
  Mutation: {
    createUser: async (
      parent: null,
      args: { username: string; password: string },
    ) => {
      // Validate user input
      if (!args.username || !args.password) {
        throw new GraphQLError('All fields are required');
      }

      // Check if user exists
      const checkUserName = await getUserByUsername(args.username);
      if (checkUserName) {
        throw new GraphQLError('Username has already been taken', {
          extensions: { code: '400' },
        });
      }

      // Check password security
      const securePassword = z
        .string()
        .nonempty()
        .min(8)
        .regex(
          new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/),
        );

      if (!securePassword.safeParse(args.password).success) {
        throw new GraphQLError(
          'Password must be at least 8 characters long and contain one special character',
        );
      }

      // Create password hash
      const passwordHash = await bcrypt.hash(args.password, 10);

      return await createUser(args.username, passwordHash);
    },
    // createPlayer

    // addLeagueAccount

    // removeLeagueAccount

    // createOrganisation

    // createAssociationByOrganisation

    // acceptAssociationByPlayer

    // endAssociation

    // deleteUserAndPlayer

    // deleteUserAndOrganisation

    // login
    login: async (
      parent: null,
      args: { username: string; password: string },
    ) => {
      await console.log('username:', args.username);
      await console.log('password:', args.password);

      // Define login schema
      const username = z.string().nonempty();
      const password = z.string().nonempty();
      if (
        !args.username ||
        !args.password ||
        !username.safeParse(args.username).success ||
        !password.safeParse(args.password).success ||
        args.username == null
      ) {
        throw new GraphQLError('Username or password are not valid', {
          extensions: { code: '400' },
        });
      }

      // Check if user exists
      const existingUser = await getUserWithPasswordHash(args.username);
      if (!existingUser) {
        throw new GraphQLError('User not found or password incorrect', {
          extensions: { code: '418' },
        });
      }

      // Compare password hash
      const isPasswordValid = await bcrypt.compare(
        args.password,
        existingUser.passwordHash,
      );
      if (!isPasswordValid) {
        throw new GraphQLError('User not found or password incorrect', {
          extensions: { code: '418' },
        });
      }

      // Create session token
      const sessionToken = crypto.randomBytes(100).toString('base64');
      const newSession = await createSession(sessionToken, existingUser.id);

      console.log('logged in', newSession);
    },
    // logout
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
