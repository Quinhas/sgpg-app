/**
 * @param {string} value - CPF numbers only.
 * @returns {string} CPF with the correct formatting.
 */
export default function formatPhone(value: string): string {
  value = value.replace(/[^\d]/g, "");
  const formattedPhone = value.replace(
    /(\d{2})(\d{1})(\d{4})(\d{4})/,
    "($1) $2 $3-$4"
  );
  return formattedPhone;
}
