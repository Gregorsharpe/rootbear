FROM node:8

WORKDIR /rootbear

COPY . /rootbear

RUN npm install
RUN npm run compile

CMD [ "npm", "start" ]