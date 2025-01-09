FROM node:23.3.0

WORKDIR /frontend

COPY package.json ./
RUN npm install
COPY . .

CMD ["sh", "-c","npm run prod"]