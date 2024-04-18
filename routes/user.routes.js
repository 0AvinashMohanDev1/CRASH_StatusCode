const express = require('express');
const {UserController} = require("../Controllers/UserController");
const {accessData,paginateUsers,authenticateToken}=require('../Middleswares/access.middleware');
const router = express.Router();
const multer  = require('multer');

const uploader=multer({
    storage:multer.diskStorage({}),

})

router.post('/signup', UserController.create);
router.get('/',authenticateToken,accessData,paginateUsers, UserController.index);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.post('/login', UserController.login);
router.post('/upload',authenticateToken,uploader.single("file"), UserController.uploadProfile);

router.get('/month/:month', UserController.getUserByMonth);

module.exports = router;
