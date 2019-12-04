FROM node:latest 

WORKDIR /usr/src/app/gql-project 

COPY package.json /usr/src/app/gql-project/  

RUN npm install 

COPY . /usr/src/app/gql-project 

EXPOSE 4000 

CMD npm start