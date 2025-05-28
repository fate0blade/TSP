const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEventById,
  deleteEventById,
  getMyEvents,
} = require("../controllers/event");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/", auth(["organizer"]), createEvent);
router.get("/", getAllEvents);
router.get("/my-events", auth(["organizer"]), getMyEvents);
router.get("/:id", getEventById);
router.put("/:id", auth(["organizer", "admin"]), updateEventById);
router.delete("/:id", auth(["organizer", "admin"]), deleteEventById);

module.exports = router;
