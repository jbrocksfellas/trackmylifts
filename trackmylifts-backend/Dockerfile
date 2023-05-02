FROM node:18.14.2-alpine3.16

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

RUN npm install -g nodemon

COPY . .

EXPOSE 4000

EXPOSE 4000

CMD ["npm", "start"]