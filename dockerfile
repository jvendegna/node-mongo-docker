#Each instruction in this file creates a new layer
#Here we are using node version 16.17.0 (LTS) as the base layer for our image, see https://hub.docker.com/_/node/
FROM node:16.17.0
#Creating a new directory for app files and setting path in the container
RUN mkdir -p /usr/src/app
#setting working directory in the container
WORKDIR /usr/src/app
#copying the package.json file(contains dependencies) from project source dir to container dir
COPY package.json /usr/src/app
# installing the dependencies into the container
RUN npm install
#copying the source code of Application into the container dir
COPY . /usr/src/app
#container exposed network port number
EXPOSE 3000
#command to run within the container to start the app
CMD ["node", "./bin/www"]