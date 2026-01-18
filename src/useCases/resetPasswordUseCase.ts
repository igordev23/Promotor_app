import { AuthRepository } from "../model/repositories/AuthRepository";

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

    if (password !== confirmPassword) {
      throw new Error("As senhas não coincidem");
    }

    if (password.length < 6) {
      throw new Error("A senha deve ter no mínimo 6 caracteres");
    }

    const success = await this.authRepository.resetPassword(password);

    if (!success) {
      throw new Error("Falha ao redefinir a senha");
    }
  }
}
