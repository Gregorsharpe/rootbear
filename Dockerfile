FROM node:14

WORKDIR /rootbear

COPY . /rootbear

RUN npm ci

CMD [ "npm", "start" ]