/**
 * @param {number} value - Value you want to check if it is plural
 * @returns {string} If plural, returns 's'. If not, return an empty string.
 */
export default function checkPlural(value: number) {
  if (value !== 1) {
    return "s";
  } else {
    return "";
  }
}
