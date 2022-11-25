FROM --platform=linux/amd64 node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
RUN npm install -g nodemon
COPY . .
EXPOSE 3000
# CMD [ "node", "server.js" ]
ENTRYPOINT ["nodemon", "start", "-H", "0.0.0.0"]