import crypto from 'node:crypto';
import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getAllAssociations,
  getAssociationsByOrganisation,
  getAssociationsByPlayer,
  getPendingAssociations,
} from '../../../database/associations';
import {
  addLeagueAccount,
  deleteLeagueAccount,
  getAllLeagueAccounts,
  getAllLeagueAccountsByPlayerId,
  getLeagueAccountById,
  getLeagueAccountBySummoner,
} from '../../../database/leagueAccounts';
import {
  createOrganisation,
  getAllOrganisations,
  getOrganisationById,
  getOrganisationBySlug,
  getOrganisationByUserId,
} from '../../../database/organisations';
import {
  createPlayer,
  getAllPlayers,
  getPlayerByAlias,
  getPlayerById,
  getPlayerBySlug,
  getPlayerByUserId,
  setLeagueMainAccount,
} from '../../../database/players';
import {
  createSession,
  deleteSessionByToken,
  getValidSessionByToken,
  Token,
} from '../../../database/sessions';
import {
  createUser,
  getAllUsers,
  getUserByID,
  getUserByToken,
  getUserByUsername,
  getUserWithPasswordHash,
  User,
} from '../../../database/users';
import { secureCookieOptions } from '../../../util/cookies';
import { getLeagueofLegendsData } from '../leagueoflegends';

type GraphQlResponseBody = { user: User } | Error;

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

    "Get player data by his slug/url-path segment"
    playerBySlug(slug: String!): Player

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

    "Get a single organisation by its slug/url-path segment"
    organisationBySlug(slug: String!): Organisation

    "Get the associations of an organisation"
    organisationAssociations(id: ID!): [Association]

    "Fetch league account data from riot api"
    riotGetLeagueAccount(summoner: String!): LeagueAccount
  }

  type Mutation {
    "Create a new user"
    createUser(
      username: String
      password: String
      repeatPassword: String
      alias: String!
    ): User
    "Create a new player"
    createPlayer(
      userId: Int!
      alias: String!
      firstName: String
      lastName: String
      contact: String
    ): Player
    createOrganisation(
      userId: Int!
      alias: String!
      contact: String
    ): Organisation
    "Add a new league account to a player"
    addLeagueAccount(summoner: String!): LeagueAccount
    "Delete a league of legends account with a certain id"
    deleteLeagueAccount(id: Int!): LeagueAccount
    "Set main league of legends account"
    setMainAccount(leagueAccountId: Int!, playerId: Int!): Player
    "Login to a dedicated user which is related to either a player or an organisation"
    login(username: String!, password: String!): User
    "Logout with the token provided"
    logout(token: String!): Token
  }

  type Token {
    token: String
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
    summoner: String
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
    summoner: String
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
    alias: String
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
    playerBySlug: async (parent: null, args: { slug: string }) => {
      return await getPlayerBySlug(args.slug);
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
    organisationBySlug: async (parent: null, args: { slug: string }) => {
      return await getOrganisationBySlug(args.slug);
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
      return await getAllLeagueAccountsByPlayerId(parent.id);
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
      args: {
        username: string;
        password: string;
        repeatPassword: string;
        alias: string;
      },
    ) => {
      // Validate user input
      if (
        !args.username ||
        !args.password ||
        !args.repeatPassword ||
        !args.alias
      ) {
        throw new GraphQLError('Please fill out all required fields', {
          extensions: { code: '40001' },
        });
      }

      // Check if user exists
      const checkUserName = await getUserByUsername(args.username);
      if (checkUserName) {
        throw new GraphQLError('Username has already been taken', {
          extensions: { code: '40002' },
        });
      }

      // Check if password is identical
      if (args.password !== args.repeatPassword) {
        throw new GraphQLError('Passwords do not match', {
          extensions: { code: '40003' },
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
          {
            extensions: { code: '40003' },
          },
        );
      }

      // Check if player or organisation exists
      const aliasTakenByPlayer = await getPlayerByAlias(args.alias);
      if (aliasTakenByPlayer) {
        throw new GraphQLError('Alias already taken', {
          extensions: { code: '40004' },
        });
      }

      const aliasTakenByOrganisation = await getPlayerByAlias(args.alias);
      if (aliasTakenByOrganisation) {
        throw new GraphQLError('Alias already in use', {
          extensions: { code: '40004' },
        });
      }

      // Check if conflict with slug can happen
      const slugTakenByPlayer = await getPlayerBySlug(args.alias);
      if (slugTakenByPlayer) {
        throw new GraphQLError('Alias already taken', {
          extensions: { code: '40004' },
        });
      }

      const slugTakenByOrganisation = await getPlayerBySlug(args.alias);
      if (slugTakenByOrganisation) {
        throw new GraphQLError('Alias already in use', {
          extensions: { code: '40004' },
        });
      }

      // Create password hash
      const passwordHash = await bcrypt.hash(args.password, 10);

      return await createUser(args.username, passwordHash);
    },
    createPlayer: async (
      parent: null,
      args: {
        userId: number;
        alias: string;
        firstName: string;
        lastName: string;
        contact: string;
      },
    ) => {
      // Validate Input
      const userId = z.number();
      const alias = z.string().nonempty().min(3);
      const firstName = z.string();
      const lastName = z.string();
      const contact = z.string();

      if (
        !userId.safeParse(args.userId).success ||
        !alias.safeParse(args.alias).success ||
        !firstName.safeParse(args.firstName).success ||
        !lastName.safeParse(args.lastName).success ||
        !contact.safeParse(args.contact).success
      ) {
        throw new GraphQLError('Invalid input', {
          extensions: { code: '40005' },
        });
      }

      // Check if user is assigned to player
      const playerExists = await getPlayerByUserId(args.userId);
      if (playerExists) {
        throw new GraphQLError('Player already assigned', {
          extensions: { code: '40006' },
        });
      }

      // Check if user is assigned to organisation
      const organisationExists = await getOrganisationByUserId(args.userId);
      if (organisationExists) {
        throw new GraphQLError('Organisation already assigned', {
          extensions: { code: '40006' },
        });
      }

      // Create player
      return await createPlayer(
        args.userId,
        args.alias,
        args.firstName,
        args.lastName,
        args.contact,
      );
    },
    addLeagueAccount: async (
      parent: null,
      args: { summoner: string },
      context: { isLoggedIn: any; user: any },
    ) => {
      // Validate input
      const checkSummoner = z.string().nonempty();
      if (!checkSummoner.safeParse(args.summoner).success) {
        throw new GraphQLError('Please add a summoner name', {
          extensions: { code: '40007' },
        });
      }

      // Check if summoner exists
      const summonerExists = await getLeagueAccountBySummoner(args.summoner);
      if (summonerExists) {
        throw new GraphQLError('League of Legends account already assigned', {
          extensions: { code: '400' },
        });
      }

      // Check authorization
      if (!context.isLoggedIn.userId === context.user.id) {
        throw new GraphQLError('Authorization failed', {
          extensions: { code: '400' },
        });
      }

      // Prepare data
      const riotData = await getLeagueofLegendsData(args.summoner);
      const playerToAssign = await getPlayerByUserId(context.user.id);

      if (!playerToAssign) {
        throw new GraphQLError('Player not found', {
          extensions: { code: '404' },
        });
      }

      if (!playerToAssign.mainaccountId) {
        const firstAccount = await addLeagueAccount(
          riotData,
          playerToAssign.id,
        );

        if (!firstAccount) {
          throw new GraphQLError('Riot Api Request failed', {
            extensions: { code: '500' },
          });
        }

        await setLeagueMainAccount(
          Number(firstAccount.id),
          Number(firstAccount.playerId),
        );
        return getLeagueAccountById(firstAccount.id);
      }

      return await addLeagueAccount(riotData, playerToAssign.id);
    },
    deleteLeagueAccount: async (
      parent: null,
      args: { id: number },
      context: { isLoggedIn: any; user: any },
    ) => {
      // Validate input
      const id = z.number();
      if (!id.safeParse(args.id).success) {
        throw new GraphQLError('Please add a valid id', {
          extensions: { code: '400' },
        });
      }

      // Check if leagueAccount exists
      const accountExists = await getLeagueAccountById(args.id);
      if (!accountExists) {
        throw new GraphQLError('League of Legends account does not exist', {
          extensions: { code: '404' },
        });
      }

      // Check authorization
      if (!context.isLoggedIn.userId === context.user.id) {
        throw new GraphQLError('Authorization failed', {
          extensions: { code: '401' },
        });
      }

      // Get Player context
      const player = await getPlayerByUserId(context.user.id);

      if (player?.mainaccountId === Number(args.id)) {
        throw new GraphQLError(
          'Please mark another league of legends account as your main account first',
          {
            extensions: { code: '400' },
          },
        );
      }

      return await deleteLeagueAccount(Number(args.id));
    },
    setMainAccount: async (
      parent: null,
      args: { leagueAccountId: number; playerId: number },
      context: { isLoggedIn: any; user: any },
    ) => {
      // Validate input
      const leagueAccountId = z.number();
      const playerId = z.number();
      if (
        !leagueAccountId.safeParse(args.leagueAccountId).success ||
        !playerId.safeParse(args.playerId).success
      ) {
        throw new GraphQLError('Please add a valid arguments', {
          extensions: { code: '400' },
        });
      }

      // Check if leagueAccount exists
      const accountExists = await getLeagueAccountById(args.leagueAccountId);
      if (!accountExists) {
        throw new GraphQLError('League of Legends account does not exist', {
          extensions: { code: '404' },
        });
      }

      // Check authorization
      if (!context.isLoggedIn.userId === context.user.id) {
        throw new GraphQLError('Authorization failed', {
          extensions: { code: '401' },
        });
      }

      // Only allow admin to change the main account
      const playerToEdit = await getPlayerByUserId(context.user.id);
      if (
        context.user.isAdmin === false &&
        Number(playerToEdit?.id) !== Number(args.playerId)
      ) {
        throw new GraphQLError(
          'You are not allowed to set this players main account',
          {
            extensions: { code: '401' },
          },
        );
      }
      // Check if league account to be the new main is among assigned accounts
      const leagueAccountExisting = await getLeagueAccountById(
        args.leagueAccountId,
      );

      if (Number(leagueAccountExisting?.playerId) !== Number(args.playerId)) {
        throw new GraphQLError(
          'The account you try to mark as main is not assigned to the player in question',
          {
            extensions: { code: '400' },
          },
        );
      }

      // Check if already assigned as main
      const player = await getPlayerByUserId(context.user.id);
      if (player?.mainaccountId === Number(args.leagueAccountId)) {
        throw new GraphQLError('Account already marked as main', {
          extensions: { code: '400' },
        });
      }

      // Update Main account
      await setLeagueMainAccount(
        Number(args.leagueAccountId),
        Number(args.playerId),
      );

      // Return the updated Player
      return await getPlayerById(args.playerId);
    },
    // updateLeagueAccounts
    createOrganisation: async (
      parent: null,
      args: {
        userId: number;
        alias: string;
        contact: string;
      },
    ) => {
      // Validate Input
      const userId = z.number();
      const alias = z.string().nonempty();
      const contact = z.string();

      if (
        !userId.safeParse(args.userId).success ||
        !alias.safeParse(args.alias).success ||
        !contact.safeParse(args.contact).success
      ) {
        throw new GraphQLError('Invalid input', {
          extensions: { code: '400' },
        });
      }

      // Check if user is assigned to player
      const playerExists = await getPlayerByUserId(args.userId);
      if (playerExists) {
        throw new GraphQLError('Player already assigned', {
          extensions: { code: '400' },
        });
      }

      // Check if user is assigned to organisation
      const organisationExists = await getOrganisationByUserId(args.userId);
      if (organisationExists) {
        throw new GraphQLError('Organisation already assigned', {
          extensions: { code: '400' },
        });
      }

      // Create Organisation
      return await createOrganisation(args.userId, args.alias, args.contact);
    },
    // createAssociation(ByOrganisation?)
    // acceptAssociationByPlayer
    // endAssociation
    // deleteUserAndPlayerAndLeagueAccounts
    // deleteUserAndOrganisation
    login: async (
      parent: null,
      args: { username: string; password: string },
    ) => {
      // Define login schema
      const username = z.string().nonempty();
      const password = z.string().nonempty();
      if (
        !args.username ||
        !args.password ||
        !username.safeParse(args.username).success ||
        !password.safeParse(args.password).success
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

      if (!newSession) {
        throw new GraphQLError('Creating session failed', {
          extensions: { code: '500' },
        });
      }

      // Set cookie
      await cookies().set({
        name: 'sessionToken',
        value: newSession.token,
        ...secureCookieOptions,
      });

      const loggedInAsUser = await getUserByUsername(args.username);
      return loggedInAsUser;
    },
    logout: async (parent: string, args: Token) => {
      await cookies().set('sessionToken', '', {
        maxAge: -1,
      });
      return await deleteSessionByToken(args.token);
    },
  },
};

// GraphQL Server Setup Using Apollo
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context: async (req, res) => {
    const sessionTokenCookie = cookies().get('sessionToken');
    const isLoggedIn =
      sessionTokenCookie &&
      (await getValidSessionByToken(sessionTokenCookie.value));
    const user = isLoggedIn
      ? await getUserByToken(sessionTokenCookie.value)
      : undefined;

    return { req, res, isLoggedIn, user };
  },
});

export async function GET(
  req: NextRequest,
): Promise<NextResponse<GraphQlResponseBody>> {
  return (await handler(req)) as NextResponse<GraphQlResponseBody>;
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<GraphQlResponseBody>> {
  return (await handler(req)) as NextResponse<GraphQlResponseBody>;
}
