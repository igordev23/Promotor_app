import { authService } from "../model/services/AuthService";

export class RecoverPasswordUseCase {
  async execute(email: string): Promise<void> {
    if (!email) {
      throw new Error("E-mail é obrigatório");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("E-mail inválido");
    }

    const success = await authService.recoverPassword(email);

    if (!success) {
      throw new Error("Falha ao enviar e-mail de recuperação");
    }
  }
}
