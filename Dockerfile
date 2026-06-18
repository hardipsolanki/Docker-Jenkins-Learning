FROM node:26-alpine

WORKDIR /home/app

COPY package.json ./

RUN npm install

ENV MONGO_URI=mongodb://admin:password@mongoDB:27017 \
    PORT=3001 

COPY . .

CMD ["node", "src/index.js"]