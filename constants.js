const STEPS = [
  {
    step: 0,
    description: "Вибір опції",
  },
  {
    step: 1,
    description: "Інформація про мене",
  },
  {
    step: 2,
    description: "Показати дні",
  },
  {
    step: 3,
    description: "Показати години запису",
  },
  {
    step: 4,
    description: "Запитати дозвіл на запит номеру телефону ",
  },
  {
    step: 5,
    description: "Запитати імя",
  },
  {
    step: 6,
    description:
      "Вивести заповнені данні і запитати чи все коректно, вивести 2 кнопки. зарезервувати чи повторити ",
  },
  {
    step: 7,
    description: "",
  },
];
const OPTIONS = [
  { title: "Про мене", value: "OPTION_1" },
  { title: "Вільні години", value: "OPTION_2" },
  { title: "Цінник", value: "OPTION_3" },
];
const ABOUT =
  "Добрий день. Мене звуть Валерія. Шукаю людей на класичний масаж всього тіла. Маю сертифікат. Беру символічну ціну, бо зараз потребую практики. Якщо зацікавлені або маєте питання, пишіть в особисті повідомлення";
// const FREEHOURS = [
//   // { title: "Понеділок", value: "DAY_MON" },
//   // { title: "Вівторок", value: "DAY_TUE" },
//   // { title: "Середа", value: "DAY_WED" },
//   // { title: "Четвер", value: "DAY_THU" },
//   // { title: "П’ятниця", value: "DAY_FRI" },
//   { title: "1", value: "DAY_1" },
//   { title: "2", value: "DAY_2" },
//   { title: "3", value: "DAY_3" },
//   { title: "4", value: "DAY_4" },
//   { title: "5", value: "DAY_5" },
//   { title: "6", value: "DAY_6" },
//   { title: "7", value: "DAY_7" },
//   { title: "8", value: "DAY_8" },
//   { title: "9", value: "DAY_9" },
//   { title: "10", value: "DAY_10" },
//   { title: "11", value: "DAY_11" },
//   { title: "12", value: "DAY_12" },
//   { title: "13", value: "DAY_13" },
//   { title: "14", value: "DAY_14" },
//   { title: "15", value: "DAY_15" },
//   { title: "16", value: "DAY_16" },
//   { title: "17", value: "DAY_17" },
//   { title: "18", value: "DAY_18" },
//   { title: "19", value: "DAY_19" },
//   { title: "20", value: "DAY_20" },
//   { title: "21", value: "DAY_21" },
//   { title: "22", value: "DAY_22" },
//   { title: "23", value: "DAY_23" },
//   { title: "24", value: "DAY_24" },
//   { title: "25", value: "DAY_25" },
//   { title: "26", value: "DAY_26" },
//   { title: "27", value: "DAY_27" },
//   { title: "28", value: "DAY_28" },
//   { title: "29", value: "DAY_29" },
//   { title: "30", value: "DAY_30" },
//   { title: "31", value: "DAY_31" },
// ];

const HOURS = [
  { title: "09:00", value: "TIME_09:00" },
  { title: "10:00", value: "TIME_10:00" },
  { title: "11:00", value: "TIME_11:00" },
  { title: "12:00", value: "TIME_12:00" },
  { title: "13:00", value: "TIME_13:00" },
  { title: "14:00", value: "TIME_14:00" },
  { title: "15:00", value: "TIME_15:00" },
  { title: "16:00", value: "TIME_16:00" },
  { title: "17:00", value: "TIME_17:00" },
  { title: "18:00", value: "TIME_18:00" },
  { title: "19:00", value: "TIME_19:00" },
];
const BOOKING = [
  { title: "Підтвердити", value: "CONFIRM" },
  { title: "Змінити", value: "CHANGE" },
];
const PRICE =
  "Масаж стоп, живота, голови - 30 злотих,\nМасаж спини - 45 злотих,\nМасаж цілого тіла - 90 злотих";

const CHECK_OPTION = " Виберіть опцію:";
const ONE_DAY = 86400000;
module.exports = {
  OPTIONS,
  ABOUT,
  HOURS,
  PRICE,
  BOOKING,
  CHECK_OPTION,
  ONE_DAY,
};
