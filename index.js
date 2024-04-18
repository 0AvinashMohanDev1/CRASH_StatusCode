const express = require("express");
const app = express();
const PORT = process.env.PORT || 4100; // Ensure this matches the environment variable casing
const { ConnectDB } = require('./config/db');
const userRouter = require("./routes/user.routes");
const {logRequests}=require("./Middleswares/access.middleware")
const { redisClient } = require("./config/redis");

app.use(express.json()); // Middleware for parsing JSON


app.use(logRequests);

// Setup routers
app.use("/users", userRouter); // Use router for specific path to organize routes better

app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>"); // Basic home page response
});

app.listen(PORT, async () => {
    try {
        await ConnectDB; // Corrected to actually call the function
        console.log(`Server is running on port ${PORT}`); // More informative startup message
    } catch (error) {
        console.log({ error: error.message }); // Error logging structure
    }
});
