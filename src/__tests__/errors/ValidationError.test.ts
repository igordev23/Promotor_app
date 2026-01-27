import { ValidationError } from "../../errors/ValidationError";

describe("ValidationError", () => {
  it("should create an error with field and message", () => {
    const error = new ValidationError("nome", "Nome inválido");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ValidationError);

    expect(error.field).toBe("nome");
    expect(error.message).toBe("Nome inválido");
  });

  it("should work with cpf field", () => {
    const error = new ValidationError("cpf", "CPF inválido");

    expect(error.field).toBe("cpf");
    expect(error.message).toBe("CPF inválido");
  });

  it("should work with telefone field", () => {
    const error = new ValidationError("telefone", "Telefone inválido");

    expect(error.field).toBe("telefone");
    expect(error.message).toBe("Telefone inválido");
  });
});
