<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[ubulut] Ubulu api consists of api endpoints to manage applications

1. [Submit new application](/api/v1/applications) [POST]
2. [Review application](/api/v1/applications/screen) [POST]
3. [Evaluate application](/api/v1/applications/evaluate) [POST]
4. [Get all applications](/api/v1/applications) [GET]
5. [Get single applications](/api/v1/applications/:applicationId) [GET]
6. [Authentication endpoint](/api/v1/auth/signin) [POST]

### Technologies Used

- **ORM**: Prisma
- **Database**: MongodB
- **Authentication**: JWT Bearer Token

## Project setup

After pulling the repo, follow these steps to set up the project:

1. From your terminal, change directory to the root directory of the project.
2. Create `.env` file with variable names from `env.sample`.
3. Install packages

```bash
$ npm install
```

4. If connecting to a personal mondodb, you'd need to seed data into the database, run the command below

```bash
$ npx prisma db seed
```

5. Start the project

```bash
$ npm run start:dev
```

### Swagger API documentation is available at

[Swagger UI](http://localhost:3334/documentation) [GET]

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Data Model Description

The database schema consists of 4 models -

1. users
2. applications
3. evaluations
4. screenings

## Asumptions

1. I have assumed that applicants do not have to sign in to the platform
2. Screeners and evaluators are system users with accounts (login information) and must login to carry out any action
3. JWT token is generated at login
4. A screener can not access the resource meant for an evaluator and vice versa; following strict role based access (RBA)

## Authentication

Two system users are seeded into the database

1. screener: gracepen@ubulu.africa
2. evaluator: johndoe@ubulu.africa
   Password for both accounts is password

## Resources

- [NestJS Documentation](https://docs.nestjs.com).
- [Prisma Documentation](http://prisma.io).
