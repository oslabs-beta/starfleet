FROM node:latest

WORKDIR /usr/src/app/starfleet

COPY package.json /usr/src/app/starfleet

RUN npm install

COPY . /usr/src/app/starfleet

EXPOSE 4000

CMD npm start 
