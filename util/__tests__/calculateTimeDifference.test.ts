import { expect, test } from '@jest/globals';
import calculateTimeDifference from '../calculateTimeDifference';

test('Checking time difference', () => {
  const testValue1 = new Date('2023-07-09 12:01:18.733506');
  const testValue2 = new Date();

  expect(calculateTimeDifference(testValue1)).toBeGreaterThan(1);
  expect(calculateTimeDifference(testValue2)).toBeLessThan(1);
});
