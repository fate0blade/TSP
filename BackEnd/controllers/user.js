const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const bcrypt = require("bcryptjs");
const Booking = require("../models/Booking");
const Events = require("../models/Event");
require("dotenv").config();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 3 * 24 * 60 * 60 * 1000,
  path: "/",
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ name, email, password, role });

    const token = generateToken(newUser.id, newUser.role);
    res.setHeader("Set-Cookie", cookie.serialize("jwt", token, cookieOptions));
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(function (err) {
        return err.message;
      });
      return res
        .status(400)
        .json({ message: "Validation Error", errors: errors });
    }

    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id, user.role);
    res.setHeader("Set-Cookie", cookie.serialize("jwt", token, cookieOptions));

    res.status(200).json({ message: "Login successful", user: user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error });
  }
};

const forgetPassword = async (req, res) => {

};


const logoutUser = function (req, res) {
  try {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("jwt", "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
      })
    );

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error: error });
  }
};

const getUserProfile = async function (req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error });
  }
};

const updateUserProfile = async function (req, res) {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(12);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(function (err) {
        return err.message;
      });
      return res
        .status(400)
        .json({ message: "Validation Error", errors: errors });
    }

    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const getUserBookings = async function (req, res) {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("event")
      .populate("user");

    if (!bookings) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error });
  }
};

const getAllUsers = async function (req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error });
  }
};

const getUserById = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error });
  }
};

const updateUserById = async function (req, res) {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(12);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(function (err) {
        return err.message;
      });
      return res
        .status(400)
        .json({ message: "Validation Error", errors: errors });
    }

    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const deleteUserById = async function (req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error });
  }
};

const verifyUser = async function (req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


const getUserEvents = async function (req, res) {
  try {
    const events = await Events.find({ organizer: req.user.id })
      .populate("organizer", "name email")
      .populate("event");
    if (!events) {
      return res.status(404).json({ message: "No events found for this user" });
    }
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user events", error: error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgetPassword,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserBookings,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  verifyUser,
  getUserEvents,
};
