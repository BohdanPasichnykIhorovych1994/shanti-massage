// db.js
const { MongoClient } = require("mongodb");

// URL підключення до MongoDB
const url = "mongodb://localhost:27017";
// Ім'я бази даних
const dbName = "bot";

// Функція для підключення до MongoDB
async function connectToMongo() {
  const client = new MongoClient(url);

  try {
    // Підключення до сервера
    await client.connect();
    console.log("Підключено до MongoDB");

    const db = client.db(dbName);

    // Повертаємо об'єкт бази даних
    return db;
  } catch (error) {
    console.error("Помилка підключення до MongoDB", error);
    throw error;
  }
}

module.exports = connectToMongo;
