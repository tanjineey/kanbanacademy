FROM node:16.3.0-alpine

ARG USER=docker
ARG UID=231072
ARG GID=231072

RUN addgroup -S ${USER} -g ${GID} \ 
&& adduser -S -G ${USER} -u ${UID} ${USER}

WORKDIR /app

COPY package.json /app

RUN npm install 

COPY . /app

EXPOSE 3001

CMD ["node","server.js"]

USER ${USER}