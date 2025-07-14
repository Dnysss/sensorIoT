const express = require("express");
const router = express.Router();
const Nivel = require("../models/Nivel");

router.post("/dados", async (req, res) => {
  // console.log("REQUISIÇÃO RECEBIDA:", req.body);
  try {
    const { nivel } = req.body;
    const novoRegistro = new Nivel({ nivel });
    await novoRegistro.save();
    res.status(201).json({ message: "Dados salvos com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar os dados." });
  }
});

router.get("/dados", async (req, res) => {
  const dado = await Nivel.findOne().sort({ createdAt: -1 });
  res.json(dado);
});

module.exports = router;
