import { expect, test } from '@jest/globals';
import { encodeString } from '../encodeString';

test('Encoding strings', () => {
  const testValue1 = 'Hallo';
  const testValue2 = 'Hallo Welt';
  const testValue3 = '"!§\\$%&/(()=';

  expect(encodeString(testValue1)).toBe('Hallo');
  expect(encodeString(testValue2)).toBe('Hallo%20Welt');
  expect(encodeString(testValue3)).toBe('%22!%C2%A7%5C%24%25%26%2F(()%3D');
});
