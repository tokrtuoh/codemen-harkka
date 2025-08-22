# Dockerfile for Express API server
FROM node
WORKDIR /harkka
COPY package.json /harkka
RUN npm install
COPY . /harkka
EXPOSE 3000
CMD ["node", "index.js"]