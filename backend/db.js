const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// const client = new Client({
//   host: "localhost",
//   user: "postgres",
//   password: "041103",
//   database: "expense_tracker_db",
//   port: 5432,
// });

client
  .connect()
  .then(() => console.log("Terhubung ke database."))
  .catch((err) => console.error("Gagal Terkoneksi:", err));

module.exports = client;
