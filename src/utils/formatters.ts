// src/utils/formatters.ts

/**
 * Remove todos os caracteres não numéricos de uma string
 * @param value String a ser processada
 * @returns String contendo apenas dígitos
 */
export const onlyDigits = (value: string): string => {
  return value.replace(/\D/g, "");
};

/**
 * Formata um CPF no padrão 000.000.000-00
 * @param value CPF (com ou sem formatação)
 * @returns CPF formatado
 */
export const formatCPF = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length === 0) return "";

  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

/**
 * Formata um telefone no padrão (00) 00000-0000 ou (00) 0000-0000
 * @param value Telefone (com ou sem formatação)
 * @returns Telefone formatado
 */
export const formatPhone = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length === 0) return "";

  // Telefone celular (11 dígitos)
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  // Telefone fixo (10 dígitos)
  return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
};

/**
 * Valida se um CPF está no formato correto (apenas dígitos)
 * @param cpf CPF a ser validado
 * @returns true se o CPF é válido
 */
export const isValidCPF = (cpf: string): boolean => {
  const digits = onlyDigits(cpf);
  return digits.length === 11;
};

/**
 * Valida se um telefone está no formato correto
 * @param phone Telefone a ser validado
 * @returns true se o telefone é válido (10 ou 11 dígitos)
 */
export const isValidPhone = (phone: string): boolean => {
  const digits = onlyDigits(phone);
  return digits.length === 10 || digits.length === 11;
};

/**
 * Extrai os dígitos e aplica formatação conforme o tipo
 * @param value Valor a ser formatado
 * @param type Tipo de formatação ('cpf' ou 'phone')
 * @returns Valor formatado
 */
export const formatValue = (value: string, type: 'cpf' | 'phone'): string => {
  if (type === 'cpf') return formatCPF(value);
  if (type === 'phone') return formatPhone(value);
  return value;
};
