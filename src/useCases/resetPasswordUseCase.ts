import { AuthRepository } from "../model/repositories/AuthRepository";

const MIN_PASSWORD_LENGTH = 6;

export class ResetPasswordUseCase {
  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  async execute(
    password: string,
    confirmPassword: string
  ): Promise<void> {
    if (!password || !confirmPassword) {
      throw new Error("Senha e confirmação são obrigatórias");
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(
        `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres`
      );
    }

    if (password !== confirmPassword) {
      throw new Error("As senhas não coincidem");
    }

    const success = await this.authRepository.resetPassword(password);

    if (!success) {
      throw new Error("Falha ao redefinir a senha");
    }
  }
}
