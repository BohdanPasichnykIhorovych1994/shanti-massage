const { Telegraf, Markup } = require("telegraf");
const { OPTIONS, HOURS } = require("./constants");
function formatDate(date) {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = "0" + mm;
  let dd = date.getDate();
  if (dd < 10) dd = "0" + dd;

  return `${yyyy}-${mm}-${dd}`;
}
function generateCalendar() {
  // Знаходимо поточну дату
  const today = new Date();

  // Знаходимо дату через 3 тижні (21 день від сьогодні)
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 21);

  let calendar = [];
  let row = [];

  // Додаємо дні тижня як перший рядок
  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
  calendar.push(daysOfWeek.map((day) => Markup.button.callback(day, "ignore")));

  // Починаємо з поточної дати
  let currentDate = new Date(today);

  // Додаємо порожні кнопки до першого дня місяця, якщо не з понеділка
  for (
    let i = 0;
    i < (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1);
    i++
  ) {
    row.push(Markup.button.callback(" ", "ignore"));
  }

  // Цикл для заповнення календаря кнопками дат
  while (currentDate < endDate) {
    row.push(
      Markup.button.callback(
        currentDate.getDate().toString(),
        `DAY_${formatDate(currentDate)}`
      )
    );

    // Якщо досягли кінця тижня або кінця періоду, додаємо рядок в календар
    if (
      currentDate.getDay() === 0 ||
      currentDate.getTime() === endDate.getTime()
    ) {
      calendar.push(row);
      row = [];
    }

    // Переходимо до наступного дня
    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (row.length > 0 && row.length < 7) {
    const remainingButtons = 7 - row.length;
    for (let i = 0; i < remainingButtons; i++) {
      row.push(Markup.button.callback(" ", "ignore")); // Додаємо порожні кнопки
    }
    calendar.push(row); // Додаємо останній рядок в календар
  }

  return calendar;
}
function defaultReply(ctx, text = "Виберіть опцію:", exept) {
  let options = OPTIONS;
  if (exept) {
    options = OPTIONS.filter((item) => exept !== item.value);
  }
  return ctx.reply(
    text,
    Markup.inlineKeyboard(
      options.map((opt) => [Markup.button.callback(opt.title, opt.value)])
    )
  );
}
function generateHourKeyboard(lib) {
  return Markup.inlineKeyboard(
    HOURS.map((hour) => {
      let title = hour.title;
      if (lib[hour.title]) {
        title = "❌" + hour.title + "❌"; // Якщо зарезервовано, змінюємо заголовок
      }
      return Markup.button.callback(
        title,
        lib[hour.title] ? `RESERVED_${hour.value}` : `TIME_${hour.value}`
      );
    }),
    { columns: 3 }
  );
}

// Функція для обробки масиву reservations і формування об'єкта з зарезервованими годинами
function getReservedHours(reservations) {
  const lib = {};
  if (reservations.length) {
    reservations.forEach((el) => {
      let hour = el.date.getHours();
      if (hour < 10) hour = "0" + hour; // Додаємо 0, якщо година менше 10
      const key = hour + ":00"; // Формуємо ключ для зберігання часу
      lib[key] = 1; // Відзначаємо цей час як зарезервований
    });
  }
  return lib; // Повертаємо об'єкт з зарезервованими годинами
}

function getReserwations(
  params={},
  sort = { _id: 1 },
  skip = 0,
  limit = 50
) {
  return db
    .collection("user_reservations")
    .find(params)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
}

module.exports = {
  generateCalendar,
  defaultReply,
  generateHourKeyboard,
  getReservedHours,
  getReserwations,
};
