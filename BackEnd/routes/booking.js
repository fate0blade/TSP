const express = require("express");
const {
  createBooking,
  getBookingById,
  cancelBookingById,
} = require("../controllers/booking");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/", auth("user"), createBooking);
router.get("/:id", auth("user"), getBookingById);
router.delete("/:id", auth("user"), cancelBookingById);

module.exports = router;
