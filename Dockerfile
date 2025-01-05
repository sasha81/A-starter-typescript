FROM node:18-alpine AS base
RUN npm i -g pnpm

FROM base AS development 
ARG APP 
ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV} 
WORKDIR /usr/src/app 
COPY package.json pnpm-lock.yaml ./ 
RUN pnpm install
COPY . . 
RUN pnpm run build ${APP} 
 
FROM base AS production 
ARG APP 
ARG PORT
ARG EXTRA_DIR
ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV} 
WORKDIR /usr/src/app 
COPY package.json pnpm-lock.yaml ./ 
RUN pnpm install --prod
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/apps/${APP}/src/${EXTRA_DIR}*/*.* /usr/src/app/apps/${APP}/src/${EXTRA_DIR}/

EXPOSE ${PORT}

# Add an env to save ARG
ENV APP_MAIN_FILE=dist/apps/${APP}/main 
CMD node ${APP_MAIN_FILE}