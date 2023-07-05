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
  acceptAssociationRequest,
  deleteAssociationByPlayerId,
  deleteAssociationsByOrganisationId,
  endAssociation,
  getAllAssociations,
  getAssocationById,
  getAssociationsByOrganisation,
  getAssociationsByPlayer,
  getCurrentAssociationsByPlayer,
  getPendingAssociationsByOrganisation,
  getPendingAssociationsByPlayer,
  requestAssociation,
} from '../../../database/associations';
import {
  addLeagueAccount,
  deleteLeagueAccount,
  deleteLeagueAccountsByPlayerId,
  getAllLeagueAccounts,
  getAllLeagueAccountsByPlayerId,
  getLeagueAccountById,
  getLeagueAccountBySummonerId,
  getLeagueAccountsByPlayerId,
  updateLeagueAccount,
} from '../../../database/leagueAccounts';
import {
  createOrganisation,
  deleteOrganisationByOrganisationId,
  getAllOrganisations,
  getOrganisationByAlias,
  getOrganisationById,
  getOrganisationBySlug,
  getOrganisationByUserId,
  updateOrganisation,
} from '../../../database/organisations';
import {
  createPlayer,
  deletePlayerByPlayerId,
  getAllPlayers,
  getPlayerByAlias,
  getPlayerById,
  getPlayerBySlug,
  getPlayerByUserId,
  removeMainAccountByPlayerId,
  setLeagueMainAccount,
  updatePlayer,
} from '../../../database/players';
import {
  createSession,
  deleteSessionByToken,
  getValidSessionByToken,
  Token,
} from '../../../database/sessions';
import {
  createUser,
  deleteUserByUserId,
  getAllUsers,
  getUserById,
  getUserByToken,
  getUserByUsername,
  getUserWithPasswordHash,
  getUserWithPasswordHashByUserId,
  updateUsername,
  updateUserWithPassword,
  User,
} from '../../../database/users';
import calculateTimeDifference from '../../../util/calculateTimeDifference';
import { secureCookieOptions } from '../../../util/cookies';
import {
  getLeagueofLegendsData,
  updateLeagueofLegendsData,
} from '../leagueoflegends';

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
    playerAssociationsByPlayerId(id: ID!): Association

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

    "Get pending association requests of an organisation"
    organisationAssociationsPending(id: ID!): [Association]

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
    "Edit a player"
    editPlayer(
      playerId: ID!
      userId: Int!
      alias: String
      firstName: String
      lastName: String
      contact: String
      oldPassword: String
      newPassword: String
      repeatPassword: String
      username: String
    ): Player
    "Delete a player"
    deletePlayer(playerId: ID!, userId: ID!): Player
    "Create a new organisation"
    createOrganisation(
      userId: Int!
      alias: String!
      contact: String
    ): Organisation
    "Edit an organisation"
    editOrganisation(
      organisationId: ID!
      userId: Int!
      alias: String
      contact: String
      oldPassword: String
      newPassword: String
      repeatPassword: String
      username: String
    ): Organisation
    "Delete an organisation"
    deleteOrganisation(organisationId: ID!, userId: ID!): Organisation
    "Add a new league account to a player"
    addLeagueAccount(summoner: String!): LeagueAccount
    "Delete a league of legends account with a certain id"
    deleteLeagueAccount(id: Int!): LeagueAccount
    "Update league accounts of a player"
    updateLeagueAccounts(playerId: ID!): [LeagueAccount]
    "Set main league of legends account"
    setMainAccount(leagueAccountId: Int!, playerId: Int!): Player
    "Login to a dedicated user which is related to either a player or an organisation"
    login(username: String!, password: String!): User
    "Logout with the token provided"
    logout(token: String!): Token
    "Request an association"
    requestAssociationByOrganisation(
      userId: Int!
      playerAlias: String!
      playerRequest: Boolean!
    ): Association
    "Deny a request or end an association"
    endAssociation(id: ID!): Association
    "Accept a new association"
    acceptAssociationByPlayer(id: ID!, playerId: Int!): Association
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
    currentAssociation: Association
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
    associations: [Association]
  }

  "Organisations can suggest an association to a player, but it has to be accepted by the player before it is valid. Both sides can end an association at any time"
  type Association {
    id: ID!
    player: Player
    organisation: Organisation
    playerRequest: Boolean
    startDate: Date
  }
`;

const resolvers = {
  // GraphQl Query Resolver
  Query: {
    users: async () => {
      return await getAllUsers();
    },
    user: async (parent: null, args: { id: string }) => {
      return await getUserById(Number(args.id));
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
    playerAssociationsByPlayerId: async (
      parent: null,
      args: { id: string },
    ) => {
      return await getCurrentAssociationsByPlayer(Number(args.id));
    },
    playersAssociationsPending: async (parent: null, args: { id: string }) => {
      return await getPendingAssociationsByPlayer(Number(args.id));
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
    organisation: async (parent: null, args: { id: string }) => {
      return await getOrganisationById(Number(args.id));
    },
    organisationBySlug: async (parent: null, args: { slug: string }) => {
      return await getOrganisationBySlug(args.slug);
    },
    organisationAssociations: async (parent: null, args: { id: string }) => {
      return await getAssociationsByOrganisation(Number(args.id));
    },
    organisationAssociationsPending: async (
      parent: null,
      args: { id: string },
    ) => {
      return await getPendingAssociationsByOrganisation(Number(args.id));
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
      return await getUserById(Number(parent.userId));
    },
    mainAccount: async (parent: any) => {
      return await getLeagueAccountById(Number(parent.mainaccountId));
    },
    leagueAccounts: async (parent: any) => {
      return await getAllLeagueAccountsByPlayerId(parent.id);
    },
    currentAssociation: async (parent: any) => {
      return await getCurrentAssociationsByPlayer(parent.id);
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
      return await getUserById(Number(parent.userId));
    },
    associations: async (parent: any) => {
      return await getAssociationsByOrganisation(parent.id);
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
    editPlayer: async (
      parent: null,
      args: {
        username: string;
        playerId: number;
        userId: number;
        alias: string;
        firstName: string;
        lastName: string;
        contact: string;
        oldPassword: string;
        newPassword: string;
        repeatPassword: string;
      },
      context: { isLoggedIn: any; user: any },
    ) => {
      // Validate Input
      const playerId = z.number();
      const userId = z.number();
      const alias = z.string().nonempty();
      const firstName = z.string();
      const lastName = z.string();
      const contact = z.string();
      const username = z.string().nonempty();
      if (
        !playerId.safeParse(Number(args.playerId)).success ||
        !userId.safeParse(Number(args.userId)).success ||
        !alias.safeParse(args.alias).success ||
        !firstName.safeParse(args.firstName).success ||
        !lastName.safeParse(args.lastName).success ||
        !contact.safeParse(args.contact).success ||
        !username.safeParse(args.username).success
      ) {
        throw new GraphQLError('Invalid Input', {
          extensions: { code: '400' },
        });
      }
      // Check authorization
      if (context.user.id !== args.userId) {
        throw new GraphQLError('Not authorized. Please login', {
          extensions: { code: '401' },
        });
      }
      async function validateAlias(aliasInput: string) {
        // Compare organisation alias with organisations
        let checkAlias = await getOrganisationByAlias(aliasInput);
        if (checkAlias) {
          throw new GraphQLError('Alias already in use', {
            extensions: { code: '40004' },
          });
        }
        // Compare organisation alias with players
        checkAlias = await getPlayerByAlias(aliasInput);
        if (checkAlias && checkAlias.userId !== Number(context.user.id)) {
          throw new GraphQLError('Alias already in use', {
            extensions: { code: '40004' },
          });
        }
      }

      // Validate username
      const checkUsername = await getUserByUsername(args.username);
      console.log(checkUsername);
      if (checkUsername && checkUsername.id !== Number(context.user.id)) {
        throw new GraphQLError('Username already in use', {
          extensions: { code: '40001' },
        });
      }

      // Check if password is subject to change
      if (args.newPassword !== '') {
        // Check if newPassword and repeatPassword are the same
        if (args.newPassword !== args.repeatPassword) {
          throw new GraphQLError(
            'New password and repeat password are not identical',
            {
              extensions: { code: '40003' },
            },
          );
        }

        // Check if new password is secure
        const securePassword = z
          .string()
          .nonempty()
          .min(8)
          .regex(
            new RegExp(
              /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
            ),
          );
        if (!securePassword.safeParse(args.newPassword).success) {
          throw new GraphQLError(
            'Password must be at least 8 characters long and contain one special character',
            {
              extensions: { code: '40003' },
            },
          );
        }

        // Compare password hash
        const existingUser = await getUserWithPasswordHashByUserId(
          context.user.id,
        );
        if (!existingUser) {
          throw new GraphQLError('User not found', {
            extensions: { code: '404' },
          });
        }
        const isPasswordValid = await bcrypt.compare(
          args.oldPassword,
          existingUser.passwordHash,
        );
        if (!isPasswordValid) {
          throw new GraphQLError('Old password incorrect', {
            extensions: { code: '40002' },
          });
        }
        await validateAlias(args.alias);

        // Create password hash
        const passwordHash = await bcrypt.hash(args.newPassword, 10);

        // Update Function
        await updateUserWithPassword(args.username, passwordHash, args.userId);
        return await updatePlayer(
          Number(args.playerId),
          args.alias,
          args.firstName,
          args.lastName,
          args.contact,
        );
      }
      // Validate alias
      await validateAlias(args.alias);

      // Update database
      await updateUsername(args.username, Number(args.userId));
      return await updatePlayer(
        Number(args.playerId),
        args.alias,
        args.firstName,
        args.lastName,
        args.contact,
      );
    },
    deletePlayer: async (
      parent: null,
      args: { playerId: number; userId: number },
      context: { isLoggedIn: any; user: any },
    ) => {
      // Validate Input
      const playerId = z.number();
      const userId = z.number();
      if (
        !userId.safeParse(Number(args.userId)).success ||
        !playerId.safeParse(Number(args.playerId)).success
      ) {
        throw new GraphQLError('Invalid Input', {
          extensions: { code: '400' },
        });
      }

      // Check if Player exists
      const player = await getPlayerById(Number(args.playerId));
      if (!player) {
        throw new GraphQLError('Organisation not found', {
          extensions: { code: '404' },
        });
      }

      // Check authorization
      if (player.userId !== context.user.id) {
        throw new GraphQLError('Not authorized. Please login', {
          extensions: { code: '401' },
        });
      }

      await deleteAssociationByPlayerId(Number(args.playerId));
      await removeMainAccountByPlayerId(Number(args.playerId));
      await deleteLeagueAccountsByPlayerId(Number(args.playerId));
      await deletePlayerByPlayerId(Number(args.playerId));
      await deleteUserByUserId(Number(args.userId));
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

      // Check authorization
      if (!context.isLoggedIn.userId === context.user.id) {
        throw new GraphQLError('Authorization failed', {
          extensions: { code: '400' },
        });
      }
      // Prepare data
      const riotData = await getLeagueofLegendsData(args.summoner);

      // Check if summoner exists
      const summonerExists = await getLeagueAccountBySummonerId(
        riotData.summonerId,
      );
      if (summonerExists) {
        throw new GraphQLError('League of Legends account already assigned', {
          extensions: { code: '400' },
        });
      }
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
    updateLeagueAccounts: async (parent: null, args: { playerId: number }) => {
      // Validate Input
      const playerId = z.number();
      if (!playerId.safeParse(Number(args.playerId)).success) {
        throw new GraphQLError('Please add a valid arguments', {
          extensions: { code: '400' },
        });
      }

      // Get all League Accounts from database
      const leagueAccounts = await getLeagueAccountsByPlayerId(
        Number(args.playerId),
      );

      // Loop through the result
      await Promise.all(
        leagueAccounts.map(async (leagueAccount) => {
          // Check timestamp
          const hoursSinceLastUpdate = calculateTimeDifference(
            leagueAccount.lastUpdate,
          );
          // Only allow an account update every hour, for testing set to 0
          if (hoursSinceLastUpdate > 0) {
            // Fetch data from RIOT API
            const newRiotData = await updateLeagueofLegendsData(
              leagueAccount.summoner,
              leagueAccount.summonerId,
            );
            // Update database
            await updateLeagueAccount(newRiotData, leagueAccount.summonerId);
          }
        }),
      );
      // Return complete list

      const updatedLeagueAccounts = await getLeagueAccountsByPlayerId(
        Number(args.playerId),
      );
      return updatedLeagueAccounts;
    },
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
    editOrganisation: async (
      parent: null,
      args: {
        username: string;
        organisationId: number;
        userId: number;
        alias: string;
        contact: string;
        oldPassword: string;
        newPassword: string;
        repeatPassword: string;
      },
      context: { isLoggedIn: any; user: any },
    ) => {
      // Validate Input
      const organisationId = z.number();
      const userId = z.number();
      const alias = z.string().nonempty();
      const contact = z.string();
      const username = z.string().nonempty();

      if (
        !organisationId.safeParse(Number(args.organisationId)).success ||
        !userId.safeParse(Number(args.userId)).success ||
        !alias.safeParse(args.alias).success ||
        !contact.safeParse(args.contact).success ||
        !username.safeParse(args.username).success
      ) {
        throw new GraphQLError('Invalid Input', {
          extensions: { code: '400' },
        });
      }

      // Check authorization
      if (context.user.id !== args.userId) {
        throw new GraphQLError('Not authorized. Please login', {
          extensions: { code: '401' },
        });
      }

      async function validateAlias(aliasInput: string) {
        // Compare organisation alias with organisations
        let checkAlias = await getOrganisationByAlias(aliasInput);

        if (checkAlias && checkAlias.userId !== Number(context.user.id)) {
          throw new GraphQLError('Alias already in use', {
            extensions: { code: '40004' },
          });
        }
        // Compare organisation alias with players
        checkAlias = await getPlayerByAlias(aliasInput);

        if (checkAlias) {
          throw new GraphQLError('Alias already in use', {
            extensions: { code: '40004' },
          });
        }
      }

      // Validate username
      const checkUsername = await getUserByUsername(args.username);
      if (checkUsername && checkUsername.id !== Number(context.user.id)) {
        throw new GraphQLError('Username already in use', {
          extensions: { code: '40001' },
        });
      }

      // Check if password is subject to change
      if (args.newPassword !== '') {
        // Check if newPassword and repeatPassword are the same
        if (args.newPassword !== args.repeatPassword) {
          throw new GraphQLError(
            'New password and repeat password are not identical',
            {
              extensions: { code: '40003' },
            },
          );
        }

        // Check if new password is secure
        const securePassword = z
          .string()
          .nonempty()
          .min(8)
          .regex(
            new RegExp(
              /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
            ),
          );
        if (!securePassword.safeParse(args.newPassword).success) {
          throw new GraphQLError(
            'Password must be at least 8 characters long and contain one special character',
            {
              extensions: { code: '40003' },
            },
          );
        }

        // Compare password hash
        const existingUser = await getUserWithPasswordHashByUserId(
          context.user.id,
        );
        if (!existingUser) {
          throw new GraphQLError('User not found', {
            extensions: { code: '404' },
          });
        }
        const isPasswordValid = await bcrypt.compare(
          args.oldPassword,
          existingUser.passwordHash,
        );
        if (!isPasswordValid) {
          throw new GraphQLError('Old password incorrect', {
            extensions: { code: '40002' },
          });
        }

        // Validate Alias
        await validateAlias(args.alias);

        // Create password hash
        const passwordHash = await bcrypt.hash(args.newPassword, 10);

        // Update database
        await updateUserWithPassword(args.username, passwordHash, args.userId);
        return await updateOrganisation(
          Number(args.organisationId),
          args.alias,
          args.contact,
        );
      }

      // Validate alias
      await validateAlias(args.alias);
      await updateUsername(args.username, Number(args.userId));
      return await updateOrganisation(
        Number(args.organisationId),
        args.alias,
        args.contact,
      );
      // Update database
    },
    deleteOrganisation: async (
      parent: null,
      args: { organisationId: number; userId: number },
      context: { isLoggedIn: any; user: any },
    ) => {
      // Validate Input
      const organisationId = z.number();
      const userId = z.number();
      if (
        !userId.safeParse(Number(args.userId)).success ||
        !organisationId.safeParse(Number(args.organisationId)).success
      ) {
        throw new GraphQLError('Invalid Input', {
          extensions: { code: '400' },
        });
      }

      // Check if Organisation exists
      const organisation = await getOrganisationById(
        Number(args.organisationId),
      );
      if (!organisation) {
        throw new GraphQLError('Organisation not found', {
          extensions: { code: '404' },
        });
      }

      // Check authorization
      if (organisation.userId !== context.user.id) {
        throw new GraphQLError('Not authorized. Please login', {
          extensions: { code: '401' },
        });
      }

      await deleteAssociationsByOrganisationId(Number(args.organisationId));
      await deleteOrganisationByOrganisationId(Number(args.organisationId));
      await deleteUserByUserId(Number(args.userId));

      console.log('it works');
    },
    requestAssociationByOrganisation: async (
      parent: null,
      args: {
        userId: number;
        playerAlias: string;
        playerRequest: boolean;
      },
      context: { isLoggedIn: any; user: any },
    ) => {
      // Validate Input
      const playerAlias = z.string().nonempty();
      const userId = z.number();
      const playerRequest = z.boolean();

      if (args.playerAlias === '') {
        throw new GraphQLError('Please fill out alias', {
          extensions: { code: '400' },
        });
      }

      if (
        !playerAlias.safeParse(args.playerAlias).success ||
        !userId.safeParse(Number(args.userId)).success ||
        !playerRequest.safeParse(args.playerRequest).success
      ) {
        throw new GraphQLError('Invalid input', {
          extensions: { code: '400' },
        });
      }
      // Check if User and Organisation exist
      const player = await getPlayerByAlias(args.playerAlias);
      if (!player) {
        throw new GraphQLError('Player not found', {
          extensions: { code: '404' },
        });
      }

      const organisation = await getOrganisationByUserId(Number(args.userId));
      if (!organisation) {
        throw new GraphQLError('Organisation not found', {
          extensions: { code: '404' },
        });
      }

      // Check authorization
      if (!context.isLoggedIn.userId === context.user.id) {
        throw new GraphQLError('Authorization failed', {
          extensions: { code: '401' },
        });
      }

      // Check if logged in user is requesting for another organisation
      if (!args.userId === context.user.id) {
        throw new GraphQLError('Authorization failed', {
          extensions: { code: '401' },
        });
      }

      // Check if association exists
      const association = await getAssociationsByPlayer(player.id);
      if (association?.organisationId === organisation.id) {
        if (association.startDate) {
          throw new GraphQLError('Player already associated', {
            extensions: { code: '400' },
          });
        }
        throw new GraphQLError('Request already sent', {
          extensions: { code: '400' },
        });
      }

      return await requestAssociation(
        player.id,
        organisation.id,
        args.playerRequest,
      );
    },
    acceptAssociationByPlayer: async (
      parent: null,
      args: {
        id: string;
        playerId: number;
      },
    ) => {
      // Validate Input
      const associationId = z.string().nonempty();
      const playerId = z.number();

      if (
        !associationId.safeParse(args.id).success ||
        !playerId.safeParse(args.playerId).success
      ) {
        throw new GraphQLError('Invalid input', {
          extensions: { code: '400' },
        });
      }

      // Check authorization
      const association = await getAssocationById(Number(args.id));
      if (!association) {
        throw new GraphQLError('Association not found', {
          extensions: { code: '404' },
        });
      }

      // Throw if playerIds not match
      if (association.playerId !== Number(args.playerId)) {
        throw new GraphQLError('Not authorized', {
          extensions: { code: '401' },
        });
      }

      // Throw if association has end_date
      if (association.endDate) {
        throw new GraphQLError(
          'Cannot set start_date to associations with end_date',
          {
            extensions: { code: '401' },
          },
        );
      }

      // Check if there is an active association
      const currentAssociation = await getCurrentAssociationsByPlayer(
        Number(args.playerId),
      );

      // If there is, end it in the process of accepting the new one
      if (currentAssociation) {
        await endAssociation(Number(currentAssociation.id));
      }

      return await acceptAssociationRequest(Number(args.id));
    },
    endAssociation: async (
      parent: null,
      args: {
        id: string;
      },
    ) => {
      // Validate Input
      const id = z.string().nonempty();

      if (!id.safeParse(args.id).success) {
        throw new GraphQLError('Invalid input', {
          extensions: { code: '400' },
        });
      }

      return await endAssociation(Number(args.id));
    },
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
    // deleteUserAndPlayerAndLeagueAccounts
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
