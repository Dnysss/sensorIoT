const request = require("supertest");
const app = require("../../app");

// Mock do modelo Nivel
jest.mock("../../models/Nivel", () => {
  const mockSave = jest.fn();

  const Nivel = jest.fn().mockImplementation(function (data) {
    this.nivel = data.nivel;
    this.porcentagem = data.porcentagem;
    this.save = mockSave;
  });

  Nivel.__mockSave = mockSave; // <-- expõe para uso no teste
  Nivel.findOne = jest.fn();

  return Nivel;
});

const Nivel = require("../../models/Nivel");

describe("Testando rotas /api/dados", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /api/dados → deve salvar dados com sucesso", async () => {
    Nivel.__mockSave.mockResolvedValueOnce(); // usa a instância exposta

    const res = await request(app)
      .post("/api/dados")
      .send({ nivel: 50, porcentagem: 50 });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Dados salvos com sucesso!");
    expect(Nivel.__mockSave).toHaveBeenCalledTimes(1);
  });

  it("POST /api/dados → deve retornar erro 500 se o save falhar", async () => {
    Nivel.__mockSave.mockRejectedValueOnce(new Error("Erro ao salvar"));

    const res = await request(app)
      .post("/api/dados")
      .send({ nivel: 30, porcentagem: 30 });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Erro ao salvar os dados.");
  });

  it("GET /api/dados → deve retornar o último dado salvo", async () => {
    const fakeData = { nivel: 80, porcentagem: 80 };

    Nivel.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue(fakeData),
    });

    const res = await request(app).get("/api/dados");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeData);
    expect(Nivel.findOne).toHaveBeenCalled();
  });

  it("GET /api/dados → deve retornar null se não houver dados", async () => {
    Nivel.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue(null),
    });

    const res = await request(app).get("/api/dados");

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });
});
