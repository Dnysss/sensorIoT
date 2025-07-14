const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });
const express = require("express");
const cors = require("cors");
const nivelRoutes = require("./routes/nivelRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", nivelRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado ao MongoDB Atlas");
    app.listen(process.env.PORT, () =>
      console.log(`Servidor rodando na porta ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("Erro na conexão com MongoDB:", err));
