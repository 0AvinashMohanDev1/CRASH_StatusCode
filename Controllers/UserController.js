const { UserModel } = require('../Models/userSchema');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uploadImage } = require("../helper/upload");
const { UserProfileModal } = require("../Models/userProfileSchema");
const { redisClient } = require('../config/redis');

class UserController {
    /**
     * @desc Get all users with role counts
     * @route GET /users
     * @access Protected (Requires authentication token)
     */
    static async index(req, res) {
        try {
            // Fetch all users
            let data = await UserModel.find();

            // Calculate role counts
            let All = data.reduce((pre, curr) => {
                if (curr.role == 'Admin') {
                    pre.totalAdmins++;
                } else if (curr.role == 'Staf') {
                    pre.totalStafs++;
                } else if (curr.role == 'User') {
                    pre.totalUsers++;
                } else {
                    pre.totalManagers++;
                }
                return pre;
            }, { totalAdmins: 0, totalManagers: 0, totalStafs: 0, totalUsers: 0 });

            res.status(200).json({ totalUsers: data.length, All, users: res.pagination.results });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * @desc Register a new user
     * @route POST /users/signup
     * @access Public
     */
    static async create(req, res) {
        try {
            let data = req.body;

            // Check if user already exists
            const user = await UserModel.findOne({ email: data.email });
            if (user) {
                return res.status(401).json({ message: 'Process failed. User already exists.' });
            }

            // Hash the password before saving the user
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            data.password = hashedPassword;

            // Create a new user
            const newUser = new UserModel(data);
            await newUser.save();

            res.status(201).send({ message: 'User created successfully', data: newUser });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }

    /**
     * @desc Login user
     * @route POST /users/login
     * @access Public
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find the user by email
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed. User not found.' });
            }

            // Compare the provided password with the stored hash
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
            }

            // User authenticated, generate a JWT
            const payload = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            };
            const secretKey = 'the_secret_key'; // Use a secret key from your environment variables in production
            const options = { expiresIn: '1h' }; // Token is valid for 1 hour
            const token = jwt.sign(payload, secretKey, options);

            await redisClient.set(`redisToken`, token, { expiresIn: '60*2' }); // Store the token in Redis with a short expiration time (60 seconds)

            res.json({
                message: 'Logged in successfully!',
                token: token
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * @desc Get user by ID
     * @route GET /users/:id
     * @access Public
     */
    static async getUserById(req, res) {
        try {
            const user = await UserModel.findOne({ _id: req.params.id });
            if (user) {
                res.send(user);
            } else {
                res.status(404).send({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }

    /**
     * @desc Update user by ID
     * @route PUT /users/:id
     * @access Public
     */
    static async update(req, res) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (updatedUser) {
                res.send({ message: 'User updated successfully', data: updatedUser });
            } else {
                res.status(404).send({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }

    /**
     * @desc Delete user by ID
     * @route DELETE /users/:id
     * @access Public
     */
    static async delete(req, res) {
        try {
            const deletedUser = await UserModel.findOneAndDelete({ _id: req.params.id });
            if (deletedUser) {
                res.send({ message: 'User deleted successfully' });
            } else {
                res.status(404).send({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }

    /**
     * @desc Upload user profile picture
     * @route POST /users/upload
     * @access Protected (Requires authentication token)
     */
    static async uploadProfile(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const upload = await uploadImage.uploadFile(req.file.path);
            if (!upload.secure_url) {
                return res.status(500).json({ message: 'File upload failed' });
            }

            const userProfile = new UserProfileModal({
                imageUrl: upload.secure_url,
                userID: req.user.id
            });

            const savedProfile = await userProfile.save();
            res.status(201).json({ message: 'File uploaded successfully', data: savedProfile });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * @desc Get users by createdAt month
     * @route GET /users/month/:month
     * @access Public
     */
    static async getUserByMonth(req, res) {
        try {
            const month = parseInt(req.params.month); // Extract month from request params

            // Use aggregation pipeline to match users with createdAt month equal to requested month
            const users = await UserModel.aggregate([
                {
                    $match: {
                        $expr: { $eq: [{ $month: '$createdAt' }, month] } // Match users by month
                    }
                },
                {
                    $project: { // Optionally, project only the desired fields
                        name: 1,
                        email: 1,
                        role: 1,
                        createdAt: 1
                    }
                }
            ]);

            res.json({ data: users });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = { UserController };
