const express = require("express");
const { assignRole } = require("../controllers/roleController");

const router = express.Router();

router.post("/assign-role", assignRole);

module.exports = router;
