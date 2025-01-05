FROM node:18-alpine AS BUILD

WORKDIR /app/apps/web

COPY package.json .

RUN npm install -g pnpm
RUN pnpm install --force


COPY . .

COPY vite.config.ts .

WORKDIR /app/libs

COPY ../../libs .

WORKDIR /app/apps/web

RUN pnpm run build

FROM nginx:1.21.0-alpine

COPY --from=BUILD /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

CMD ["nginx","-g","daemon off;"]

# An easier version
# FROM node:18-alpine

# WORKDIR /app

# COPY package.json .

# COPY vite.config.ts .

# RUN npm install --force

# COPY . .

# EXPOSE 3005

# CMD [ "npm", "run", "dev" ]
