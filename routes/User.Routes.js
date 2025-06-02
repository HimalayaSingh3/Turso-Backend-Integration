const express = require("express");
const router = express.Router();
const UserController = require("../controllers/User.Controller");
const authenticateToken = require("../middleware/authMiddleware");

// Auth routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Protected route
router.get("/profile", authenticateToken, UserController.profile);

module.exports = router;
