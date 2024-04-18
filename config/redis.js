// Import the createClient function from the 'redis' library
const { createClient } = require("redis");

// Load environment variables from a .env file
require("dotenv").config();

// Retrieve Redis credentials from environment variables
const userName = process.env.redisName;
const password = process.env.redisPassword;

// Create a Redis client with the specified connection details
const redisClient = createClient({
    // Redis server connection URL with username, password, host, and port
    url: `redis://${userName}:${password}@redis-12652.c264.ap-south-1-1.ec2.cloud.redislabs.com:12652`
});

// Event handler for Redis client errors
redisClient.on("error", (err) => {
    console.log(err);
});

// Connect to the Redis server asynchronously using an immediately invoked async function
(async () => await redisClient.connect())();

// Event handler for Redis client ready state
redisClient.on("ready", () => {
    console.log("Redis connected");
});

// Export the Redis client for use in other parts of the application
module.exports = {
    redisClient
};