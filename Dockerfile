FROM node:14

WORKDIR /rootbear

COPY . /rootbear

RUN npm install
RUN npm run compile

CMD [ "npm", "start" ]