import { RecoverPasswordUseCase } from "../../useCases/RecoverPasswordUseCase";
import { authService } from "../../model/services/AuthService";

jest.mock("../../model/services/AuthService", () => ({
  authService: {
    recoverPassword: jest.fn(),
  },
}));

describe("RecoverPasswordUseCase", () => {
  let useCase: RecoverPasswordUseCase;

  beforeEach(() => {
    useCase = new RecoverPasswordUseCase();
    jest.clearAllMocks();
  });

  it("deve lançar erro se o e-mail não for informado", async () => {
    await expect(useCase.execute(""))
      .rejects
      .toThrow("E-mail é obrigatório");
  });

  it("deve lançar erro se o e-mail for inválido", async () => {
    await expect(useCase.execute("email_invalido"))
      .rejects
      .toThrow("E-mail inválido");
  });

  it("deve chamar o serviço de recuperação de senha", async () => {
    (authService.recoverPassword as jest.Mock)
      .mockResolvedValue(true);

    await useCase.execute("teste@email.com");

    expect(authService.recoverPassword)
      .toHaveBeenCalledWith("teste@email.com");
  });

  it("deve lançar erro quando o serviço falhar", async () => {
    (authService.recoverPassword as jest.Mock)
      .mockResolvedValue(false);

    await expect(
      useCase.execute("teste@email.com")
    ).rejects.toThrow("Falha ao enviar e-mail de recuperação");
  });
});
