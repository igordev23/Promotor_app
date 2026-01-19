import { leadUseCase } from "../../useCases/LeadUseCase";

describe("parseError – cobertura total", () => {
    it("retorna fallback para erro undefined", () => {
        expect(leadUseCase.parseError(undefined)).toBe("Ocorreu um erro");
    });

    it("retorna string diretamente", () => {
        expect(leadUseCase.parseError("erro")).toBe("erro");
    });

    it("retorna mensagem do Error", () => {
        expect(leadUseCase.parseError(new Error("msg"))).toBe("msg");
    });

    it("retorna mensagem de objeto com message", () => {
        expect(leadUseCase.parseError({ message: "obj" })).toBe("obj");
    });

    it("retorna string JSON para objeto sem message", () => {
        expect(leadUseCase.parseError({})).toBe("{}");
    });

});