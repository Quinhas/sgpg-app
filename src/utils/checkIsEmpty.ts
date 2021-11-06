/**
 * @param {string} value - Value you want to check if it is empty
 * @returns {string | null} If empty, returns null. If not, return the original value.
 */
export default function isEmpty(value: string): string | null {
  if (value.trim() === "") {
    return null;
  } else {
    return value;
  }
}
