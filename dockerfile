FROM node:16.18.1

WORKDIR /app

COPY . /app

ENV NODE_ENV production
ENTRYPOINT ["node","./express-app.js"]

