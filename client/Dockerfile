FROM node:18-alpine

# Ajoutez cette ligne avant les autres commandes
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

EXPOSE 3000
CMD ["npm", "start"]