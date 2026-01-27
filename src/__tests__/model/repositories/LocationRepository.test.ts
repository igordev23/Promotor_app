import axios from "axios";
import { LocationRepository } from "../../../model/repositories/LocationRepository";
import { authService } from "../../../model/services/AuthService";

jest.mock("axios");

jest.mock("../../../model/services/AuthService", () => ({
  authService: {
    getToken: jest.fn(),
  },
}));

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockUse = jest.fn();

(axios.create as jest.Mock).mockReturnValue({
  get: mockGet,
  post: mockPost,
  interceptors: {
    request: {
      use: mockUse,
    },
  },
});

describe("LocationRepository", () => {
  let repository: LocationRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (authService.getToken as jest.Mock).mockResolvedValue("fake-token");

    repository = new LocationRepository();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  /* =========================
     CONSTRUCTOR / INTERCEPTOR
  ========================= */

  it("should register auth interceptor", () => {
    expect(mockUse).toHaveBeenCalled();
  });

  /* =========================
     getCurrentLocation
  ========================= */

  it("should return current location successfully", async () => {
    const mockLocation = {
      latitude: -23.5,
      longitude: -46.6,
      timestamp: 123456789,
    };

    mockGet.mockResolvedValueOnce({
      data: mockLocation,
    });

    const result = await repository.getCurrentLocation("123");

    expect(mockGet).toHaveBeenCalledWith(
      "/supervisor/promotores/123/localizacao-atual"
    );
    expect(result).toEqual(mockLocation);
  });

  it("should throw error when getCurrentLocation fails", async () => {
    mockGet.mockRejectedValueOnce({
      response: { data: { message: "Erro localização atual" } },
    });

    await expect(
      repository.getCurrentLocation("123")
    ).rejects.toThrow("Erro localização atual");
  });

  /* =========================
     getLocationHistory
  ========================= */

  it("should return location history successfully", async () => {
    const mockHistory = [
      { latitude: 1, longitude: 2, timestamp: 1 },
      { latitude: 3, longitude: 4, timestamp: 2 },
    ];

    mockGet.mockResolvedValueOnce({
      data: mockHistory,
    });

    const result = await repository.getLocationHistory("123");

    expect(mockGet).toHaveBeenCalledWith(
      "/supervisor/promotores/123/historico-localizacao"
    );
    expect(result).toEqual(mockHistory);
  });

  it("should throw error when getLocationHistory fails", async () => {
    mockGet.mockRejectedValueOnce({
      message: "Erro histórico",
    });

    await expect(
      repository.getLocationHistory("123")
    ).rejects.toThrow("Erro histórico");
  });

  /* =========================
     sendLocation
  ========================= */

  it("should send location successfully", async () => {
    mockPost.mockResolvedValueOnce({});

    const payload = {
      idPromotor: "123",
      latitude: -10,
      longitude: -20,
      timestamp: 999,
    };

    await expect(
      repository.sendLocation(payload)
    ).resolves.not.toThrow();

    expect(mockPost).toHaveBeenCalledWith(
      "/promotor/localizacao",
      payload
    );
  });

  it("should throw error when sendLocation fails", async () => {
    mockPost.mockRejectedValueOnce({
      response: { data: { message: "Erro ao enviar localização" } },
    });

    await expect(
      repository.sendLocation({
        idPromotor: "123",
        latitude: 0,
        longitude: 0,
        timestamp: 0,
      })
    ).rejects.toThrow("Erro ao enviar localização");
  });
});
