export const parseLoginError = (err: unknown): string => {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();

    if (msg.includes("network")) {
      return "Erro de conexão. Verifique sua internet e tente novamente.";
    }

    if (msg.includes("timeout")) {
      return "O servidor demorou para responder. Tente novamente em instantes.";
    }

    if (msg.includes("401") || msg.includes("unauthorized")) {
      return "Acesso não autorizado. Tente novamente.";
    }

    if (msg.includes("500")) {
      return "Erro interno do servidor. Tente novamente mais tarde.";
    }

    // fallback amigável
    return "Não foi possível realizar o login. Tente novamente.";
  }

  return "Erro inesperado ao realizar login.";
};
