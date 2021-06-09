const keys = require("./keys");
const express = require("express");

const server = express();

server.use(express.json());

server.use((req, res, next) => {
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, X-Requested-With, Authorization");

  next();
});


// time for redis-cli
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

let redisPublisher = redisClient.duplicate();

// express Route Handlers
server.get("/", (req, res) => {
  res.send({ message: "okay" });
})

server.get("/values/all", async (req, res) => {
  res.send("values.rows");
});

// getting current values from redis server
server.get("/values/current", (req, res) => {
  redisClient.hgetall("values", (error, values) => {
    res.send(values);
  })
})

server.post("/values", (req, res) => {
  const index = req.body.index;
  console.log("index", index);

  try {
    if (parseInt(index) > 25) {
      return res.status(422).send({ message: "index too large!" });
    }

    redisClient.hset("values", index, "Nothing Calculated yet!");
    redisPublisher.publish("insert", index);

    res.send({ working: true });
  } catch (e) {
    res.send("message: ", e.message);
  }

});

server.listen(5000, () => {
  console.log("server is up on port: 5000");
});