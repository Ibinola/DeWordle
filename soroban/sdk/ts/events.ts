export interface DecodedEvent<T = unknown> {
  contractId: string;
  topic: string;
  payload: T;
  ledger?: number;
  txHash?: string;
}

export function parseCoreGameEvent(raw: {
  contractId: string;
  topic: string;
  value: unknown;
  ledger?: number;
  txHash?: string;
}): DecodedEvent {
  return {
    contractId: raw.contractId,
    topic: raw.topic,
    payload: raw.value,
    ledger: raw.ledger,
    txHash: raw.txHash,
  };
}
