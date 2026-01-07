import { renderHook, act } from "@testing-library/react";
import { useListLeadsViewModel } from "../../viewmodel/useListLeadsViewModel";
import { leadUseCase } from "../../useCases/LeadUseCase";

jest.mock("../../useCases/LeadUseCase");

describe("Integração - Remover Lead", () => {
    it("deve remover lead via ViewModel", async () => {
        (leadUseCase.getLeads as jest.Mock).mockResolvedValue([
            { id: "1", nome: "Teste", cpf: "123", telefone: "999" },
        ]);

        (leadUseCase.removeLead as jest.Mock).mockResolvedValue(undefined);

        const { result } = renderHook(() => useListLeadsViewModel());

        await act(async () => {
            await result.current.actions.loadLeads();
            await result.current.actions.removeLead("1");
        });

        expect(leadUseCase.removeLead).toHaveBeenCalledWith("1");
        expect(result.current.state.leads).toHaveLength(0);
    });
});
