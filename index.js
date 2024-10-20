const express = require("express");
const connectToMongo = require("./db");
const app = express();
const { Telegraf, Markup } = require("telegraf");
const {
  OPTIONS,
  ABOUT,
  HOURS,
  PRICE,
  BOOKING,
  CHECK_OPTION,
  ONE_DAY,
} = require("./constants");
const { bot } = require("./tg-bot");
const userRoutes = require("./routes/user-routes");

app.use(userRoutes);

app.listen(3000, async () => {
  db = await connectToMongo();
  console.log("Start success");
});
