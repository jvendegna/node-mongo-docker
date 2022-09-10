# Visitor Counter

Alright, here we have a simple node app using express as a webserver and API.

MVC shit is in public/routes/views

The main application is in bin/www - typical express app setup stuff. This app is not impressive, you can recreate the exact same setup in like 30 seconds. Literally run `npx express-generator --view=pug <folder-name>` and it will create a folder with pretty much everything you need ready to go.

What you're really curious about though is in the package.json, dockerfile, routes/visitors.js, and the docker-compose file. So let's talk about those.

1. `package.json`: Look at the scripts. NPM scripts are feccing awesome. Embrace them.
    * `start`: start the application on localhost, this won't really work anymore, we have the docker way. but you run it like `npm start`
    * `mongo`: again, not really useful. But you can see this is where I started. I would `npm run mongo` to launch mongodb in the background, and access it on `mongodb://localhost:27017`
    * docker:build: `npm run docker:build` here's where the fun starts. This will build this application on your computer in a docker container image called `visitorcounter:local`
    * `compose:up`: `npm run compose:up` starts docker compose with this application linked to mongodb.
    * `detatched`: `npm run detatched` starts docker compose without taking over your shell, runs in the background.
    * `compose:down`: `npm run compose:down` stops docker compose (when it's running in the background)

2. `dockerfile`: see the comments in it, they're detailed and should explain well what is in the image.
3. `routes/visitors.js`: 
    * Sets up the mongodb connection, creates a schema, uploads a document on first visit, retreives that document on each subsequent visit then increments the count and saves the document back to mongo before sending the updated count back to the visitor.
    * Every line of this file is commented well
4. `docker-compose.yaml`:
    * runs this application and mongodb in containers.
    * creates a virtual network for them to communicate on
    * defines the ports each service uses and maps them to localhost ports. For example, try changing `3000:3000` to `7500:3000` and when you start docker compose again you will need to access the app on `localhost:7500` instead of `localhost:3000`
    * You can use Mongo Atlas to view the mongo collections and documents, the connection string for it will just be `mongodb://localhost:27017` when the container is running.
    * `links` is a pretty cool litle thing. See: [https://docs.docker.com/compose/networking/](https://docs.docker.com/compose/networking/) for the truth, but from my understanding it allows you to define multiple hostnames for other containers, here it sort of just slaps it on the same virtual network... or something. IDK maybe it's not needed at all. but if we do ```links:
        - "mongo:mongodb:database:fuckingdocumentstore"```
    then we could use any one of those as hostnames to reach our mongo container from the visitor-count app.
    * `build: .` will build the container if it's not found on your machine. You can just `docker-compose up` without running a docker build command first.
    * mongo volume: Here I map a directory in this project directory on your host machine called `data` to a directory at path /data/db inside the running mongo container. This is how the database persists between runs. Try it out. Start the application, go to the /visitors routes a few times. Stop the application. Start it again. Visit the route. The counter will resume where it left off at the previous section. Now, delete the `data` directory inside this project directory. Start the app again. You're back at your first visit. Congradulations, you just lost data!
