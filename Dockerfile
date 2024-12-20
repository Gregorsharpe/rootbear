FROM node:22.2.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

CMD [ "npm", "start" ]