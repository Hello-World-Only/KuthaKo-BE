// const redis = require("redis");

// let client;

// const connectRedis = async () => {
//   client = redis.createClient({
//     url: process.env.REDIS_URL || "redis://localhost:6379",
//   });

//   client.on("error", (err) => console.log("Redis Client Error", err));

//   await client.connect();
//   console.log("Redis Connected");
// };

// module.exports = { connectRedis, client };
