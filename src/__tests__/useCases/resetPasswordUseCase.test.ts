import { ResetPasswordUseCase } from "../../useCases/resetPasswordUseCase";
import { AuthRepository } from "../../model/repositories/AuthRepository";

describe("ResetPasswordUseCase", () => {
  let authRepository: jest.Mocked<AuthRepository>;
  let useCase: ResetPasswordUseCase;

  beforeEach(() => {
    authRepository = {
      recoverPassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    useCase = new ResetPasswordUseCase(authRepository);
  });

  it("deve lançar erro se a senha estiver vazia", async () => {
    await expect(
      useCase.execute("", "")
    ).rejects.toThrow("Senha e confirmação são obrigatórias");
  });

  it("deve lançar erro se as senhas não coincidirem", async () => {
    await expect(
      useCase.execute("123456", "654321")
    ).rejects.toThrow("As senhas não coincidem");
  });

  it("deve lançar erro se a senha for muito curta", async () => {
    await expect(
      useCase.execute("123", "123")
    ).rejects.toThrow("A senha deve ter no mínimo 6 caracteres");
  });

  it("deve lançar erro se o repositório falhar", async () => {
    authRepository.resetPassword.mockResolvedValueOnce(false);

    await expect(
      useCase.execute("123456", "123456")
    ).rejects.toThrow("Falha ao redefinir a senha");
  });

  it("deve executar com sucesso quando os dados forem válidos", async () => {
    authRepository.resetPassword.mockResolvedValueOnce(true);

    await expect(
      useCase.execute("123456", "123456")
    ).resolves.not.toThrow();

    expect(authRepository.resetPassword).toHaveBeenCalledWith("123456");
  });
});
