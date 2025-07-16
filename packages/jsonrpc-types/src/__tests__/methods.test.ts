// Test suite for RPC methods and type definitions
import { describe, it, expect } from 'vitest';
import { RPC_METHODS } from '../methods';

describe('RPC_METHODS', () => {
  it('should export an array of RPC method names', () => {
    expect(Array.isArray(RPC_METHODS)).toBe(true);
    expect(RPC_METHODS.length).toBeGreaterThan(0);
  });

  it('should contain expected core NEAR RPC methods', () => {
    const expectedMethods = [
      'block',
      'chunk',
      'tx',
      'query',
      'EXPERIMENTAL_changes',
      'EXPERIMENTAL_changes_in_block',
      'EXPERIMENTAL_genesis_config',
      'EXPERIMENTAL_protocol_config',
      'gas_price',
      'health',
      'light_client_proof',
      'network_info',
      'status',
      'validators',
      'EXPERIMENTAL_tx_status',
    ];

    expectedMethods.forEach(method => {
      expect(RPC_METHODS).toContain(method);
    });
  });

  it('should only contain string values', () => {
    RPC_METHODS.forEach(method => {
      expect(typeof method).toBe('string');
      expect(method.length).toBeGreaterThan(0);
    });
  });

  it('should not contain duplicate methods', () => {
    const uniqueMethods = new Set(RPC_METHODS);
    expect(uniqueMethods.size).toBe(RPC_METHODS.length);
  });

  it('should have consistent naming convention', () => {
    RPC_METHODS.forEach(method => {
      // Should not contain spaces or special characters except underscore
      expect(method).toMatch(/^[a-zA-Z_][a-zA-Z0-9_]*$/);
    });
  });
});
