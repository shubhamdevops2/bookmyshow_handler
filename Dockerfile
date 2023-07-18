FROM node:current-alpine3.16

WORKDIR $HOME/app

COPY ["package.json", "package-lock.json*" ,  "./"]

RUN npm install

COPY . .

CMD [ "node", "index.js" ]