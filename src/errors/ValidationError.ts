export class ValidationError extends Error {
  constructor(
    public field: "nome" | "cpf" | "telefone",
    message: string
  ) {
    super(message);
  }
}
