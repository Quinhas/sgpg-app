/**
 * @param {string} value - CPF numbers only.
 * @returns {string} CPF with the correct formatting.
 */
export default function formatCPF(value: string): string {
  value = value.replace(/[^\d]/g, "");
  const formattedCPF = value.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4"
  );
  return formattedCPF;
}
