const express = require("express");
const client = require("./db");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

// Read (Mengirim Data Pengluaran)
app.get("/pengeluaran", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM pengeluaran");

    res.json(result.rows);
  } catch (error) {
    res.status(500).json("Internal Server Error.");
  }
});

// Create (Menambah Data Pengeluaran)
app.post("/pengeluaran", async (req, res) => {
  try {
    const { nama, nominal } = req.body;
    await client.query(
      "INSERT INTO pengeluaran (nama, nominal) VALUES ($1, $2) RETURNING *",
      [nama, nominal],
    );
    res.json("Data pengeluaran berhasil ditambahkan!");
  } catch (error) {
    res.status(500).json("Internal Server Error.");
    console.error(error);
  }
});

// Update (Mengubah Data Pengeluaran) menggunakan metode PUT
app.put("/pengeluaran/:id", async (req, res) => {
  try {
    const idUbah = parseInt(req.params.id);
    const { nama, nominal } = req.body;

    const result = await client.query(
      "UPDATE pengeluaran SET nama = $1, nominal = $2 WHERE id = $3 RETURNING *",
      [nama, nominal, idUbah],
    );

    if (result.rowCount === 0) {
      res.status(404).json(`Data dengan ID ${idUbah} tidak ditemukan.`);
    } else {
      res.json(`Data dengan ID ${idUbah} berhasil diubah.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error.");
  }
});

// Delete (Menghapus Data Pengeluaran)
app.delete("/pengeluaran/:id", async (req, res) => {
  try {
    const idHapus = parseInt(req.params.id);

    const result = await client.query(
      "DELETE FROM pengeluaran WHERE id = $1 RETURNING *",
      [idHapus],
    );

    if (result.rowCount === 0) {
      res.status(404).json(`Data dengan ID ${idHapus} tidak ditemukan.`);
    } else {
      res.json(`Data dengan ID ${idHapus} berhasil dihapus!`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error.");
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di localhost:${port}`);
});
