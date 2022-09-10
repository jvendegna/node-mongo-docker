var express = require('express');
var router = express.Router();

// mongodb setup
const mongoose = require('mongoose') 

// connect to local mongodb (in the container, the magic is the -p flag in the docker run script -p 27017:27017 maps localhost:27017 to the container's 27107 port)
// but docker uses hostnames, look at the docker compose file, this service is called 'mongo' so you use that instead of localhost here, because your application isn't running
// on localhost. It's running on a special network in docker-compose which is port-forwarded to your localhost. But 'localhost' here would cause the app to look inside 
// of its own container for mongo, but mongo is in a different container, so that would not work.
mongoose.connect("mongodb://mongo:27017/counter")

// create the visitor schema in mongodb to hold the visitor count
const visitorSchema = new mongoose.Schema({
  name: String,
  count: Number
})

//create Visitor Table in counterDB
const Visitor = mongoose.model("Visitor", visitorSchema)

/* GET users listing. */
router.get('/', async function(req, res) {
  // Store records from Visitor table
  let visitors = await Visitor.findOne({name: 'localhost'})

  // First visit? (no document exists named 'localhost')
  if (visitors == null) {

    // create a default record
    const beginCount = new Visitor({
      name: 'localhost',
      count: 1
    })

    //save it to mongo
    beginCount.save()

    // send the count back to the visitor (response)
    res.send("Visitor Count: 1")

    // logging is important, helps with debugging
    console.log("first visit!")
  }
  else {
    // increment the count of visitors by one
    visitors.count += 1
    // save it to the db
    visitors.save()
    // send the response
    res.send("Visitor Count: " + visitors.count)
    // log it
    console.log("Visior Count: " + visitors.count)
  }
});

// for use in app.js
module.exports = router;
