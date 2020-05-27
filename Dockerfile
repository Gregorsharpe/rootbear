FROM node:14

WORKDIR /rootbear

COPY . /rootbear

RUN npm install

CMD [ "npm", "compile" ]
CMD [ "npm", "start" ]