FROM node:22-alpine3.21 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NPM_CONFIG_LOGLEVEL="info"
RUN corepack enable
WORKDIR /app/backend
COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps
RUN pnpm fetch --prod
RUN pnpm install -r --offline --prod

FROM base AS build-deps
RUN pnpm fetch
RUN pnpm install -r --offline

FROM build-deps AS build
COPY ./ ./
RUN pnpm run build

FROM node:lts-alpine
ARG BE_PORT
COPY --from=prod-deps /app/backend/node_modules ./node_modules
COPY --from=build /app/backend/dist ./dist
EXPOSE $BE_PORT
CMD [ "node", "dist/src/main" ]