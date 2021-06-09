const keys = require("./keys");
const redis = require("redis");

const client = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const dup_client = client.duplicate();

// calculating fibonacci value
function fib(index) {
  if (index <= 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

dup_client.on("message", (channel, message) => {
  console.log("onmessage redis channel  ", channel, " message = ", message);

  client.hset('values', message, fib(parseInt(message)));
});


dup_client.subscribe("insert");