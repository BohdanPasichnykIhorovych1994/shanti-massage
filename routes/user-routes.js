const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  addUser,
  getReservationsList,
} = require("../controllers/user-controller");

router.get("/users", getUsers); //добавити /api до кожного запиту

router.get("/users/:phoneNumber", getUser); //замінити на айді

router.post("/users", addUser);

router.get("/api/reservations", getReservationsList);

module.exports = router;
