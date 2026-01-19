import { AuthRepository } from "../model/repositories/AuthRepository";

export class RecoverPasswordUseCase {
  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  async execute(email: string): Promise<void> {
    if (!email) {
      throw new Error("E-mail é obrigatório");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("E-mail inválido");
    }

    const success = await this.authRepository.recoverPassword(email);

    if (!success) {
      throw new Error("Falha ao enviar e-mail de recuperação");
    }
  }
}
