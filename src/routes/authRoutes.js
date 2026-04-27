const router = require("express").Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register); // for testing
router.post("/login", login);

module.exports = router;
