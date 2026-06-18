# FROM node:26-alpine

# WORKDIR /home/app

# COPY package.json ./

# RUN npm install

# COPY . .

# CMD ["node", "src/index.js"]


FROM node:20-alpine

WORKDIR /home/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]