const request = require("supertest");
const app = require("../app");

// Podemos mockar as rotas caso necessário
jest.mock("../routes/nivelRoutes", () => {
  const express = require("express");
  const router = express.Router();

  router.get("/test", (req, res) => res.json({ ok: true }));
  return router;
});

describe("Testando configuração do app.js", () => {
  it("Deve carregar middlewares e rotas corretamente", async () => {
    const res = await request(app).get("/api/test");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});

