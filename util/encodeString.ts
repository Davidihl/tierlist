export function encodeString(string: string): string {
  const encodedString = encodeURIComponent(string);
  return encodedString;
}
