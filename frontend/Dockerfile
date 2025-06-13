FROM node:24-alpine3.21

WORKDIR /app/frontend

EXPOSE 3000

RUN corepack prepare yarn@3.5.1 --activate

COPY ./frontend ./
COPY ./frontend/.env ./.env
COPY ./frontend/package.json .

RUN yarn

EXPOSE $FE_PORT

CMD ["yarn", "dev"]