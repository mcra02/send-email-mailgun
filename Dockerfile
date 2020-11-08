FROM node:12

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

ENV TZ=America/Lima

EXPOSE 80

CMD ["yarn", "prod"]