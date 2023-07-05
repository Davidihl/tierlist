# Tierlist

## Introduction

This project was created during the UpLeveled.io bootcamp in July 2023 to showcase the knowledge I during the course. The README also serves as documentation for the project, providing an overview of the technologies I used and short descriptions of the core features implemented. The project involves the development of a web application using Next.js framework, Tailwindcss, PostgreSQL as the database, and integration of a GraphQL API and a third-party REST API from Riot Games for fetching League of Legends account data. The application allows users to sign up and login as either organisations or players, facilitating association requests between them. Additionally, players can showcase their League of Legends accounts and display their respective strengths.

## Idea of this Project

The idea of this project is to showcase a way of creating a comprehensive platform specifically designed for League of Legends players and esports organisations. This prototype wants to serve as a proof of concept for the Austrian Esports Federation, which is considering the development of such a platform. The primary goals of this platform are to elevate players and organisations within the Austrian esports scene and facilitate its growth.

## Database Structure

To support the functionalities of the platform, the following database setup was created. For a complete overview, please follow the provided schema: [Database Schema](https://drawsql.app/teams/davids-team-30/diagrams/final-project-tierlist)

placeholder schema screenshot

Please find a description of the purpose of the tables below:

### Users

The "Users" table will store the general information of individuals who register on the platform. This includes fields such as username, email address, password (hashed and securely stored), and other relevant user details.

### Players

The "Players" table will be associated with the "Users" table, establishing a one-to-one relationship. It will store additional player-specific information, such as player rankings, preferred roles, achievements, and other League of Legends-related data. Each player will be linked to a user account, enabling seamless integration between their player profiles and platform-wide functionalities.

### Organisations

Similar to players, the "organisations" table will be associated with the "Users" table, establishing a one-to-one relationship. It will store specific information about esports organisations, such as their name and contact information.

### League Accounts

The "League Accounts" table will be related to the "Players" table, establishing a one-to-many relationship. This table will store League of Legends account information for each player, such as account IDs, summoner names, and associated statistics. Players can add multiple league accounts, enabling them to showcase their strengths across different profiles.

### Associations

The "Associations" table will facilitate the relationship between players and organisations. It will store information regarding association requests, start- and end-date, and any additional relevant details. This table will establish a one-to-many relationship, as a players can be associated with only one organisation but an organisations can be associated with many players.

### Sessions

The "Sessions" table will be associated with the "Users" table, establishing a one-to-many relationship. It will store data related to user sessions, including session IDs, login timestamps, and a token which will be matched with a cookie to verify the authentification. This enables the management of user sessions and provides the foundation for secure authentication and authorization mechanisms.

## Design using Tailwind CSS and DaisyUI

The design will leverage Tailwind CSS, a utility-first CSS framework, to streamline the development process and create consistent and responsive components. DaisyUI, a plugin for Tailwind CSS, will further enhance the design by providing a set of ready-to-use components and styles, ensuring a cohesive and visually appealing interface. While not strictly adhering to Material Design, the UI tries incorporate certain principles inspired by it. This includes clean typography, the use of colors to convey hierarchy and interactivity, and the implementation of subtle animations and transitions to enhance user engagement.

## Mobile First

The frontend of this project was created with a mobile-first approach, ensuring that the interface adapts seamlessly to different screen sizes and devices.

## Getting Started

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
