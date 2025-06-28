// Client-specific types

export interface RpcRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params: unknown;
}

export interface RpcResponse<T = unknown> {
  jsonrpc: '2.0';
  id: string | number;
  result?: T;
  error?: RpcError;
}

export interface RpcError {
  code: number;
  message: string;
  data?: unknown;
}

export class NearRpcError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'NearRpcError';
  }
}
