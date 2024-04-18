
const jwt = require('jsonwebtoken');
const {UserModel}=require("../Models/userSchema")
const {redisClient}=require("../config/redis")
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = await redisClient.get('redisToken')||authHeader && authHeader.split(' ')[1];
    // console.log(token);

    if (token == null) return res.sendStatus(401); // if there isn't any token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // if the token is not valid
        req.user = user;
        next();
    });
}

function paginateUsers(req, res, next) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5; // Default limit is 5

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    res.pagination = {};

    UserModel.countDocuments().then(count => {
        if (endIndex < count) {
            res.pagination.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            res.pagination.previous = {
                page: page - 1,
                limit: limit
            };
        }

        UserModel.find()
            .limit(limit)
            .skip(startIndex)
            .then(users => {
                res.pagination.results = users;
                next();
            })
            .catch(error => res.status(500).json({ message: error.message }));
    });
}


function logRequests(req, res, next) {
    console.log(`${new Date().toISOString()} - ${req.method} request to ${req.originalUrl}`);
    next();
}

function accessData(req, res, next) {
    try {
        
        // Check if the request is to the specific path and the user has the required role
        if (req.originalUrl.includes('/users/') && (req.user.role=='Admin'||req.user.role=='Manager')) {
            next(); // Allow access if the user is an Admin or Manager
        } else {
            // Redirect to a user-specific page if not an Admin or Manager
            if (req.originalUrl.includes('/users/')) {
                // Return a redirect response
                return res.redirect(`/users/${req.user.id}`);
            }
            // Otherwise, continue with the next middleware
            next();
        }
    } catch (error) {
        res.status(500).send({ message: 'Server error while checking access permissions.' });
    }
}


module.exports={
    logRequests,
    accessData,
    authenticateToken,
    paginateUsers
}