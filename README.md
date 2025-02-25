# A-starter-typescript
Here are instructions to launch the typescript part of the starter, described in [this paper](https://dzone.com/articles/a-starter-for-a-distributed-multi-language-analyti).
## Install dependencies
+ Make sure you have Node 18.16.0 and pnpm 8.8.0 or later installed.
+ From `A-starter-typescript` folder, run `pnpm install` to install the dependecies.
## To Run the back-end Apps
The app follows hexagonal architecture. Every inbound adapter has its own `app.listen()` method.
All inbound adapters are listed in `nest-cli.json` file. Debug configs are in the `.vscode/launch.json` file.
All apps are started from the `A-starter-typescript` folder with `pnpm run start:dev <app-name>`. If there is a type in the `<app-name>`, the default app (`rest-adapter`) is started. 

+ AMQP: `pnpm run start:dev amqp-simmple-adapter`,
+ GraphQl Schema first: `pnpm run start:dev graphql-adapter`,
+ GraphQl Code first: `pnpm run start:dev graphql-adapter-code`,
+ gRPC: `pnpm run start:dev grpc-adapter`,
+ Rest: `pnpm run start:dev rest-adapter`,
+ WS: `pnpm run start:dev ws-gateway`,
+ Tests: `pnpm run test`.

## To Run the front-end App
+ From `A-starter-typescript/apps/web` folder, run `pnpm install` to install the dependecies.
+ From the same folder, run `pnpm run dev` to start the front app.


