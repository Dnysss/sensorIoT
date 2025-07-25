const express = require("express");
const cors = require("cors");
const nivelRoutes = require("./routes/nivelRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api", nivelRoutes);

module.exports = app;
