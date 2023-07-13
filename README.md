# Tierlist

## Introduction

This project was created during the UpLeveled.io bootcamp in July 2023 to showcase the knowledge I gathered during the course. The README also serves as documentation for the project, providing an overview of the technologies I used and short descriptions of the core features implemented. The project involves the development of a web application using Next.js framework, Tailwind CSS, PostgreSQL as the database, the integration of a GraphQL API (which handles all selects, inserts, updates and deletes in the database) with Apollo and a third-party REST API from Riot Games for fetching League of Legends account data. The application allows users to sign up and login as either organisations or players, facilitating association requests between them. Additionally, players can showcase their League of Legends accounts displaying their respective strengths.

## Idea of this Project

The idea of this project is to showcase a way of creating a comprehensive platform specifically designed for League of Legends players and esports organisations. This prototype wants to serve as a proof of concept for the Austrian Esports Federation, which is considering the development of such a platform. The primary goals of this platform are to elevate players and organisations within the Austrian esports scene and facilitate its growth.

## Database Structure

To support the functionalities of the platform, the following database setup was created. For a complete overview, please follow the provided schema: [Database Schema](https://drawsql.app/teams/davids-team-30/diagrams/final-project-tierlist)

<img width="984" alt="Bildschirmfoto 2023-07-04 um 11 16 46" src="https://github.com/Davidihl/tierlist/assets/111972510/bfa02877-e97f-4eec-b852-12e04fce8798">

## Design using Tailwind CSS and DaisyUI

The frontend was created with [Tailwind CSS](https://tailwindcss.com/), and [DaisyUI](https://daisyui.com/), a plugin for Tailwind CSS. While not strictly adhering to Material Design, the UI tries incorporate certain principles inspired by it. This includes clean typography, the use of colors to convey hierarchy and interactivity, and the implementation of subtle animations and transitions to enhance user engagement.

## Mobile First

The frontend of this project was created with a mobile-first approach, ensuring that the interface adapts seamlessly to different screen sizes and devices.

## Getting Started

### Requirements

You need to add a `RIOT_API_KEY` in your local `.env`. You can get one from the [RIOT Developer Portal](https://developer.riotgames.com/). Caution: Development keys expire after 24 hours so you may apply for a personal key with a proper project description. It usually takes up to 2 weeks for RIOT to approve an application.

### Start up the repository

First, run install the dependencies:

```bash
npm install
# or
pnpm install
```

To start the application:

```bash
npm run dev
# or
pnpm dev
```

You need to setup a Postgres database, once it is setup, please run:

```bash
npm migrate up
# or
pnpm migrate up
```

To revert, run:

```bash
npm migrate down
# or
pnpm migrate down
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Core Features

### User Signup / Login

The application provides user registration functionality, allowing individuals to sign up as either organizations or players. During the signup process, users must provide relevant information such as username, email address, and password. User authentication and authorization via session cookie combined with a database entry have been implemented to increase security while accessing the application.

### Association Requests

Organizations can send association requests to players for potential collaboration or partnership. This feature allows organizations to connect with players based on shared interests, team requirements, or any other criteria. Association requests include relevant details, and notifications are sent to the targeted players.

### Accepting/Denying Association Requests

Players have the ability to review and respond to incoming association requests. They can accept or deny the requests based on their preferences. Accepted associations result in a formal connection between the player and organization, enabling further collaboration within the application.

### League of Legends Account Integration

Players can link their League of Legends accounts to their profiles within the application. The integration with the Riot Games REST API allows the application to retrieve account data, such as player statistics, ranking information, and match history. This information is used to showcase the player's strengths and achievements within the League of Legends community. The data is stored inside the database to decrease of times, the RIOT API has to be called, since RIOT rate limits all of their API keys. Additionally a rate limiter has been implemented in the application as well, to further decrease the risk of an invalidation of the API key by RIOT.
