const express = require('express');
const { UserController } = require("../Controllers/UserController");
const { accessData, paginateUsers, authenticateToken } = require('../Middleswares/access.middleware');
const router = express.Router();
const multer = require('multer');

const uploader = multer({
    storage: multer.diskStorage({}),
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       role:
 *         type: string
 *       createdAt:
 *         type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         type: integer
 *         required: false
 *         default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         type: integer
 *         required: false
 *         default: 10
 *         description: Number of users per page
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 All:
 *                   type: object
 *                   properties:
 *                     totalAdmins:
 *                       type: integer
 *                     totalManagers:
 *                       type: integer
 *                     totalStafs:
 *                       type: integer
 *                     totalUsers:
 *                       type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/User'
 */

router.get('/', authenticateToken, accessData, paginateUsers, UserController.index);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 */

router.get('/:id', UserController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 */

router.put('/:id', UserController.update);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 */

router.post('/', UserController.create);

/**
 * @swagger
 * /users/upload:
 *   post:
 *     summary: Upload a user profile picture
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/definitions/User'
 */

router.post('/upload', authenticateToken, uploader.single("file"), UserController.uploadProfile);

/**
 * @swagger
 * /users/month/{month}:
 *   get:
 *     summary: Get users by createdAt month
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         description: Month in numeric format (1-12)
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Users created in the specified month
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 */

router.get('/month/:month', UserController.getUserByMonth);

module.exports = router;
