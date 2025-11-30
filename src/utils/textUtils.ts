// Função para truncar textos longos
export function truncate(text: string, max: number): string {
  if (!text) return "";
  return text.length > max ? text.substring(0, max) + "..." : text;
}
