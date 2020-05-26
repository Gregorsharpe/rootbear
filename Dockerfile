FROM node:8

WORKDIR /rootbear

COPY . /rootbear
RUN npm run compile
RUN npm install

CMD [ "npm", "start" ]