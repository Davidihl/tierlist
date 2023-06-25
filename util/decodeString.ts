export function decodeString(string: string): string {
  const decodedString = decodeURIComponent(string);
  return decodedString;
}
