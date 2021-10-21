export default function checkPlural(value: number) {
  if (value !== 1) {
    return "s";
  } else {
    return "";
  }
}
