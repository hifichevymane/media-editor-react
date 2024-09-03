FROM node:20.17-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "deploy" ]
