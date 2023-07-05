# Tierlist

## Introduction

This project was created during the UpLeveled.io bootcamp in July 2023 to showcase the knowledge I gathered during the course. The README also serves as documentation for the project, providing an overview of the technologies I used and short descriptions of the core features implemented. The project involves the development of a web application using Next.js framework, Tailwind CSS, PostgreSQL as the database, and integration of a GraphQL API with Apollo and a third-party REST API from Riot Games for fetching League of Legends account data. The application allows users to sign up and login as either organisations or players, facilitating association requests between them. Additionally, players can showcase their League of Legends accounts and display their respective strengths.

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
