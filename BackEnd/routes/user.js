const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  getUserBookings,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserEvents
} = require("../controllers/user");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth(["admin"]), getAllUsers);
router.get("/profile", auth(["user", "organizer", "admin"]), getUserProfile);
router.put("/profile", auth(["user", "organizer", "admin"]), updateUserProfile);
router.get("/bookings", auth(["user"]), getUserBookings);
router.get("/events", auth(["organizer"]), getUserEvents);
router.get("/:id", auth(["admin"]), getUserById);
router.put("/:id", auth(["admin"]), updateUserById);
router.delete("/:id", auth(["admin"]), deleteUserById);



module.exports = router;
