export interface Journey {
  id?: number;
  idPromotor?: string;
  promotor_id?: string;
  status: "ativo" | "inativo";
  inicio?: number | string;
  fim?: number | string;
}
