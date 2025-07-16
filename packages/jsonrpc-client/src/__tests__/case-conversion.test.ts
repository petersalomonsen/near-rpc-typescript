// Test suite for case conversion utilities
import { describe, it, expect } from 'vitest';
import {
  camelToSnake,
  snakeToCamel,
  convertKeysToSnakeCase,
  convertKeysToCamelCase,
} from './test-utils';

describe('Case Conversion Utilities', () => {
  describe('camelToSnake', () => {
    it('should convert camelCase to snake_case', () => {
      expect(camelToSnake('camelCase')).toBe('camel_case');
      expect(camelToSnake('someVariableName')).toBe('some_variable_name');
      expect(camelToSnake('accountId')).toBe('account_id');
      expect(camelToSnake('blockHeight')).toBe('block_height');
    });

    it('should handle single words', () => {
      expect(camelToSnake('word')).toBe('word');
      expect(camelToSnake('test')).toBe('test');
    });

    it('should handle empty strings', () => {
      expect(camelToSnake('')).toBe('');
    });

    it('should handle strings starting with uppercase', () => {
      expect(camelToSnake('CamelCase')).toBe('_camel_case');
      expect(camelToSnake('AccountId')).toBe('_account_id');
    });

    it('should handle consecutive uppercase letters', () => {
      expect(camelToSnake('HTMLElement')).toBe('_h_t_m_l_element');
      expect(camelToSnake('XMLParser')).toBe('_x_m_l_parser');
    });
  });

  describe('snakeToCamel', () => {
    it('should convert snake_case to camelCase', () => {
      expect(snakeToCamel('snake_case')).toBe('snakeCase');
      expect(snakeToCamel('some_variable_name')).toBe('someVariableName');
      expect(snakeToCamel('account_id')).toBe('accountId');
      expect(snakeToCamel('block_height')).toBe('blockHeight');
    });

    it('should handle single words', () => {
      expect(snakeToCamel('word')).toBe('word');
      expect(snakeToCamel('test')).toBe('test');
    });

    it('should handle empty strings', () => {
      expect(snakeToCamel('')).toBe('');
    });

    it('should handle strings starting with underscore', () => {
      expect(snakeToCamel('_snake_case')).toBe('SnakeCase');
      expect(snakeToCamel('_account_id')).toBe('AccountId');
    });

    it('should handle multiple consecutive underscores', () => {
      expect(snakeToCamel('some__double__underscore')).toBe(
        'someDoubleUnderscore'
      );
    });

    it('should handle trailing underscores', () => {
      expect(snakeToCamel('trailing_underscore_')).toBe('trailingUnderscore_');
    });
  });

  describe('convertKeysToSnakeCase', () => {
    it('should convert object keys to snake_case', () => {
      const input = {
        accountId: 'test.near',
        blockHeight: 12345,
        finality: 'final',
      };

      const expected = {
        account_id: 'test.near',
        block_height: 12345,
        finality: 'final',
      };

      expect(convertKeysToSnakeCase(input)).toEqual(expected);
    });

    it('should handle nested objects', () => {
      const input = {
        outerProp: {
          innerProp: 'value',
          anotherInner: {
            deepProp: 'deep value',
          },
        },
      };

      const expected = {
        outer_prop: {
          inner_prop: 'value',
          another_inner: {
            deep_prop: 'deep value',
          },
        },
      };

      expect(convertKeysToSnakeCase(input)).toEqual(expected);
    });

    it('should handle arrays of objects', () => {
      const input = {
        items: [
          { itemId: 1, itemName: 'first' },
          { itemId: 2, itemName: 'second' },
        ],
      };

      const expected = {
        items: [
          { item_id: 1, item_name: 'first' },
          { item_id: 2, item_name: 'second' },
        ],
      };

      expect(convertKeysToSnakeCase(input)).toEqual(expected);
    });

    it('should handle primitive values', () => {
      expect(convertKeysToSnakeCase('string')).toBe('string');
      expect(convertKeysToSnakeCase(123)).toBe(123);
      expect(convertKeysToSnakeCase(true)).toBe(true);
      expect(convertKeysToSnakeCase(null)).toBe(null);
      expect(convertKeysToSnakeCase(undefined)).toBe(undefined);
    });

    it('should handle arrays of primitives', () => {
      const input = ['string', 123, true, null];
      expect(convertKeysToSnakeCase(input)).toEqual(input);
    });

    it('should handle empty objects and arrays', () => {
      expect(convertKeysToSnakeCase({})).toEqual({});
      expect(convertKeysToSnakeCase([])).toEqual([]);
    });

    it('should handle mixed arrays', () => {
      const input = [
        { itemProp: 'value' },
        'string',
        123,
        { anotherProp: 'another value' },
      ];

      const expected = [
        { item_prop: 'value' },
        'string',
        123,
        { another_prop: 'another value' },
      ];

      expect(convertKeysToSnakeCase(input)).toEqual(expected);
    });
  });

  describe('convertKeysToCamelCase', () => {
    it('should convert object keys to camelCase', () => {
      const input = {
        account_id: 'test.near',
        block_height: 12345,
        finality: 'final',
      };

      const expected = {
        accountId: 'test.near',
        blockHeight: 12345,
        finality: 'final',
      };

      expect(convertKeysToCamelCase(input)).toEqual(expected);
    });

    it('should handle nested objects', () => {
      const input = {
        outer_prop: {
          inner_prop: 'value',
          another_inner: {
            deep_prop: 'deep value',
          },
        },
      };

      const expected = {
        outerProp: {
          innerProp: 'value',
          anotherInner: {
            deepProp: 'deep value',
          },
        },
      };

      expect(convertKeysToCamelCase(input)).toEqual(expected);
    });

    it('should handle arrays of objects', () => {
      const input = {
        items: [
          { item_id: 1, item_name: 'first' },
          { item_id: 2, item_name: 'second' },
        ],
      };

      const expected = {
        items: [
          { itemId: 1, itemName: 'first' },
          { itemId: 2, itemName: 'second' },
        ],
      };

      expect(convertKeysToCamelCase(input)).toEqual(expected);
    });

    it('should handle primitive values', () => {
      expect(convertKeysToCamelCase('string')).toBe('string');
      expect(convertKeysToCamelCase(123)).toBe(123);
      expect(convertKeysToCamelCase(true)).toBe(true);
      expect(convertKeysToCamelCase(null)).toBe(null);
      expect(convertKeysToCamelCase(undefined)).toBe(undefined);
    });

    it('should handle arrays of primitives', () => {
      const input = ['string', 123, true, null];
      expect(convertKeysToCamelCase(input)).toEqual(input);
    });

    it('should handle empty objects and arrays', () => {
      expect(convertKeysToCamelCase({})).toEqual({});
      expect(convertKeysToCamelCase([])).toEqual([]);
    });
  });

  describe('bidirectional conversion', () => {
    it('should be reversible for simple objects', () => {
      const original = {
        accountId: 'test.near',
        blockHeight: 12345,
        someProperty: 'value',
      };

      const snakeCase = convertKeysToSnakeCase(original);
      const backToCamel = convertKeysToCamelCase(snakeCase);

      expect(backToCamel).toEqual(original);
    });

    it('should be reversible for nested objects', () => {
      const original = {
        outerProp: {
          innerProp: 'value',
          nestedArray: [{ itemProp: 'item1' }, { itemProp: 'item2' }],
        },
      };

      const snakeCase = convertKeysToSnakeCase(original);
      const backToCamel = convertKeysToCamelCase(snakeCase);

      expect(backToCamel).toEqual(original);
    });
  });
});
