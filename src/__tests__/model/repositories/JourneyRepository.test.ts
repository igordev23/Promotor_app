import axios from "axios";
import { JourneyRepository } from "../../../model/repositories/JourneyRepository";
import { authService } from "../../../model/services/AuthService";

jest.mock("axios");

jest.mock("../../../model/services/AuthService", () => ({
  authService: {
    getToken: jest.fn(),
  },
}));

const mockPost = jest.fn();
const mockGet = jest.fn();
const mockUse = jest.fn();

(axios.create as jest.Mock).mockReturnValue({
  post: mockPost,
  get: mockGet,
  interceptors: {
    request: {
      use: mockUse,
    },
  },
});
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});


describe("JourneyRepository", () => {
  let repository: JourneyRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    (authService.getToken as jest.Mock).mockResolvedValue("fake-token");
    repository = new JourneyRepository();
  });

  /* =========================
     CONSTRUCTOR / INTERCEPTOR
  ========================= */

  it("should register auth interceptor", () => {
    expect(mockUse).toHaveBeenCalled();
  });

  /* =========================
     startJourney
  ========================= */

  it("should start journey successfully", async () => {
    mockPost.mockResolvedValueOnce({});

    await expect(
      repository.startJourney("123")
    ).resolves.not.toThrow();

    expect(mockPost).toHaveBeenCalledWith(
      "/promotor/jornada/iniciar",
      { idPromotor: "123" }
    );
  });

  it("should throw error when startJourney fails", async () => {
    mockPost.mockRejectedValueOnce({
      response: { data: { message: "Erro API" } },
    });

    await expect(
      repository.startJourney("123")
    ).rejects.toThrow("Erro API");
  });

  /* =========================
     endJourney
  ========================= */

    it("should return journey status successfully", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        promotor_id: "123",
        status: "ativo",
      },
    });

    const result = await repository.getJourneyStatus("123");

    expect(result).toMatchObject({
      idPromotor: "123",
      status: "ativo",
    });
  });


  it("should throw error when endJourney fails", async () => {
    mockPost.mockRejectedValueOnce({
      message: "Falha ao finalizar",
    });

    await expect(
      repository.endJourney("123")
    ).rejects.toThrow("Falha ao finalizar");
  });

  /* =========================
     getJourneyStatus
  ========================= */

   it("should return journey status successfully", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        promotor_id: "123",
        status: "ativo",
      },
    });

    const result = await repository.getJourneyStatus("123");

    expect(result).toMatchObject({
      idPromotor: "123",
      status: "ativo",
    });
  });

  it("should fallback to idPromotor if API returns idPromotor", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        idPromotor: "123",
        status: "ativo",
      },
    });

    const result = await repository.getJourneyStatus("123");

    expect(result.idPromotor).toBe("123");
  });

  it("should return inactive journey on 404", async () => {
    mockGet.mockRejectedValueOnce({
      response: { status: 404 },
    });

    const result = await repository.getJourneyStatus("123");

    expect(result).toEqual({
      idPromotor: "123",
      status: "inativo",
    });
  });

  it("should throw error when getJourneyStatus fails", async () => {
    mockGet.mockRejectedValueOnce({
      response: {
        data: { message: "Erro ao buscar jornada" },
      },
    });

    await expect(
      repository.getJourneyStatus("123")
    ).rejects.toThrow("Erro ao buscar jornada");
  });
});
