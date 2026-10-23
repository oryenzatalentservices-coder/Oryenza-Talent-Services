const express = require("express");
const router = express.Router();
const inquiryController = require("../controllers/inquiryController");

// Client inquiry routes
router.post("/", inquiryController.createInquiry);
router.get("/", inquiryController.getInquiries);
router.patch("/:id", inquiryController.updateInquiry);
router.delete("/:id", inquiryController.deleteInquiry);

module.exports = router;
