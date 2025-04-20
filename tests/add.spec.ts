import { add } from '../src/add';
import { expect, describe, test } from 'vitest';

describe('add', () => {
  test('should add two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });

  test('should add negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
  });

  test('should add zero', () => {
    expect(add(0, 0)).toBe(0);
  });
});