FROM node:8-slim

WORKDIR /rootbear

COPY . /rootbear
RUN npm install

CMD [ "npm", "start" ]