FROM node:26-alpine

WORKDIR /home/app

COPY package.json ./

RUN npm install

COPY . .

CMD ["node", "src/index.js"]