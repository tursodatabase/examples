FROM node:20

WORKDIR /usr/src/app

RUN mkdir -p dbs

COPY package.json ./

RUN npm install -g bun

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "src/index.ts"]