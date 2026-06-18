# syntax=docker/dockerfile:1
FROM node:22-slim
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000
# Dev server keeps content hot-reloading; for prod swap to `npm run build && npm start`.
CMD ["npm", "run", "dev"]
