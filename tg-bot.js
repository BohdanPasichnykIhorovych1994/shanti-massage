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
const cron = require("node-cron");
const {
  generateCalendar,
  defaultReply,
  generateHourKeyboard,
  getReservedHours,
  getReserwations,
} = require("./functions");

// let db = null;
function checkUser(id) {
  if (!users[id]) {
    users[id] = { step: 0 };
  }
}
function setStep(id, step) {
  users[id].step = step;
}
function resetUser(id) {
  if (!users[id]) {
    users[id] = { step: 0 };
  } else {
    users[id].step = 0;
  }
}

const TOKEN = "7546055062:AAFJ3cM7_7YW-F_As36J_mX1sUJP5pTdK7E";
const bot = new Telegraf(TOKEN);
const users = {};
bot.start((ctx) => {
  checkUser(ctx.update.message.from.id);
  defaultReply(ctx, "Привіт! Виберіть опцію:");
});

bot.action(OPTIONS[0].value, (ctx) => {
  resetUser(ctx.update.callback_query.from.id);
  ctx.reply(ABOUT);
  defaultReply(ctx, CHECK_OPTION, OPTIONS[0].value);
});

bot.action(OPTIONS[2].value, (ctx) => {
  resetUser(ctx.update.callback_query.from.id);
  ctx.reply(PRICE);
  defaultReply(ctx, CHECK_OPTION, OPTIONS[2].value);
});

bot.action(OPTIONS[1].value, (ctx) => {
  const id = ctx.update.callback_query.from.id;
  checkUser(id);
  setStep(id, 2);

  return ctx.reply(
    "Оберіть день тижня:",
    Markup.inlineKeyboard(generateCalendar())
  );
});

bot.action(/DAY_/, async (ctx) => {
  const id = ctx.update.callback_query.from.id;
  if (users[id] && users[id].step === 2) {
    const start = new Date(ctx.update.callback_query.data.split("_")[1]);
    const end = new Date(+start + ONE_DAY);
    const reservations = await getReserwations({
      date: {
        $gte: start,
        $lt: end,
      },
    });
    const lib = getReservedHours(reservations);
    users[id].day = ctx.update.callback_query.data.split("_")[1];
    setStep(id, 3);
    return ctx.reply("Оберіть годину:", generateHourKeyboard(lib));
  } else {
    resetUser(id);
    defaultReply(ctx, (text = " Виберіть опцію:"));
  }
});

bot.action(/RESERVED_/, (ctx) => {
  return ctx.reply("❌ Цей час уже зарезервовано. Оберіть інший час. ❌");
});

bot.action(/TIME_/, (ctx) => {
  const id = ctx.update.callback_query.from.id;
  if (users[id] && users[id].step === 3) {
    users[id].time = ctx.update.callback_query.data.split("_")[2];
    setStep(id, 4);
    return ctx.reply(
      `Ви вибрали дату: ${users[id].day}, час: ${users[id].time}.`,
      Markup.inlineKeyboard([
        [Markup.button.callback("Підтвердити", "CONFIRM")],
        [Markup.button.callback("Змінити", OPTIONS[1].value)],
      ])
    );
  } else {
    resetUser(id);
    defaultReply(ctx, (text = " Виберіть опцію:"));
  }
});

bot.on("text", (ctx) => {
  const id = ctx.message.from.id;
  // Перевірка, чи користувач перебуває на етапі вибору дати
  if (users[id] && users[id].step === 2) {
    defaultReply(ctx, "Ви ввели невірний формат дати, спробуйте ще раз:");
  } else if (!users[id] || users[id].step !== 3) {
    // Скидання до початкового меню
    users[id] = { step: 0 };
    defaultReply(ctx, "Ви ввели невірний формат дати, спробуйте ще раз:");
  } else {
    // Якщо користувач на етапі вибору часу, можна обробляти текст по-іншому
    // В залежності від потреби
    ctx.reply("Будь ласка, виберіть час зі списку.");
  }
  resetUser(id);
});

bot.action("CONFIRM", async (ctx) => {
  const id = ctx.update.callback_query.from.id;

  const userFromDb = await db.collection("users").findOne({ telegram_id: id });

  if (userFromDb) {
    setStep(id, 6);
    await createReservation(id, userFromDb, ctx);
  } else if (users[id] && users[id].step === 4) {
    setStep(id, 5);
    return ctx.reply(
      "Щоб продовжити, поділіться своїм номером телефону:",
      Markup.keyboard([
        [Markup.button.contactRequest("Надіслати номер телефону")],
      ])
        .oneTime()
        .resize()
    );
  } else {
    resetUser(id);
    defaultReply(ctx, "Сталася помилка, будь ласка, виберіть опцію ще раз:");
  }
});

bot.on("contact", async (ctx) => {
  const id = ctx.message.from.id;
  const contact = ctx.message.contact;

  try {
    // Перевіряємо, чи є користувач в базі
    const userFromDb = await db
      .collection("users")
      .findOne({ telegram_id: id });

    if (!userFromDb) {
      const userData = {
        telegram_id: id,
        first_name: ctx.message.from.first_name,
        last_name: ctx.message.from.last_name,
        user_name: ctx.message.from.username,
        phone_number: contact.phone_number,
        created_at: new Date(),
      };

      const user = await db.collection("users").insertOne(userData);

      // Тепер створюємо резервацію для нового користувача
      await createReservation(id, userData, ctx);
      console.log(userData);
    }
  } catch (error) {
    console.error("Error saving data: ", error);
    await ctx.reply(
      "Сталася помилка під час збереження даних. Спробуйте ще раз."
    );
  }
});

// Функція для створення резервації
async function createReservation(id, user, ctx) {
  try {
    await db.collection("user_reservations").insertOne({
      user_id: user._id,
      date: new Date(users[id].day + " " + users[id].time),
    });
    console.log(user);

    resetUser(id);
    await ctx.reply(
      `Ваша нова резервацію успішно створена на ${users[id].day} о ${users[id].time}.`,
      Markup.removeKeyboard() // Прибираємо клавіатуру після отримання контакту
    );
  } catch (error) {
    console.error("Error saving reservation to database: ", error);
    await ctx.reply(
      "Сталася помилка під час створення резервації. Спробуйте ще раз."
    );
  }
}

function getDateFromToday(daysToAdd) {
  const today = new Date();
  const resultDate = new Date(today);
  resultDate.setDate(today.getDate() + daysToAdd);
  resultDate.setHours(0, 0, 0, 0);
  return resultDate;
}
async function sendReminders() {
  // Використання функції
  const tomorrow = getDateFromToday(1);
  const dayAfterTomorrow = getDateFromToday(2);

  console.log(tomorrow, dayAfterTomorrow);
  try {
    // Знайти всі резервації, які заплановані на наступний день
    const reservations = await getReserwations({
      date: {
        $gte: tomorrow,
        $lt: dayAfterTomorrow,
      },
    });
    console.log("Знайдено резервацій:", reservations.length);

    let adminMessage = "Нагадування адміну: Завтрашні масажі:\n";

    for (const reservation of reservations) {
      const user = await db
        .collection("users")
        .findOne({ _id: reservation.user_id });

      if (user) {
        const hours = reservation.date.getHours().toString().padStart(2, "0");
        const minutes = reservation.date
          .getMinutes()
          .toString()
          .padStart(2, "0");
        const message = `Привіт, ${user.first_name}! Нагадуємо, що завтра о ${hours}:${minutes}
 у вас заплановано масаж.`;
        // Надсилаємо повідомлення користувачу через бота
        console.log("Знайдено резервацій:", reservations.length);

        await bot.telegram
          .sendMessage(user.telegram_id, message)

          .catch((error) => {
            console.error("Помилка при надсиланні повідомлення:", error);
          });

        // Додаємо інформацію до повідомлення для адміністратора
        adminMessage += `- ${user.first_name} ${user.last_name}, час: ${hours}:${minutes}\n`;
      }
    }

    const admin = await db.collection("admin").findOne({});
    if (admin && admin.telegram_id) {
      adminTelegramId = admin.telegram_id;
    }

    await bot.telegram
      .sendMessage(adminTelegramId, adminMessage)
      .then(() => {
        console.log("Повідомлення адміну успішно надіслано.");
      })
      .catch((error) => {
        console.error("Помилка при надсиланні повідомлення адміну:", error);
      });
  } catch (error) {
    console.error("Помилка під час отримання резервацій:", error);
  }
}

// Cron-операція
cron.schedule("17 22 * * *", () => {
  console.log("Виконується перевірка резервацій для відправки нагадувань...");
  sendReminders();
});

bot.launch().then(() => {
  console.log("Бот запущено в режимі опитування");
});
module.exports = { bot };
