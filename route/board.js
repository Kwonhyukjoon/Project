const express = require("express");
const auth = require("../middleware/auth");
const { BoardUpload } = require("../controllers/board");

const router = express.Router();

router.route("/").put(auth, BoardUpload);
module.exports = router;
