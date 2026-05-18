import { Contract, TransactionBuilder, TimeoutInfinite, xdr } from "@stellar/stellar-sdk";
import type { Server, Account } from "@stellar/stellar-sdk/rpc";
import type { SorobanNetworkConfig } from "./network";

export async function buildContractTx(params: {
  server: Server;
  source: Account;
  network: SorobanNetworkConfig;
  contractId: string;
  method: string;
  args?: xdr.ScVal[];
  fee?: string;
}) {
  const contract = new Contract(params.contractId);
  const tx = new TransactionBuilder(params.source, {
    fee: params.fee ?? "100",
    networkPassphrase: params.network.passphrase,
  })
    .addOperation(contract.call(params.method, ...(params.args ?? [])))
    .setTimeout(TimeoutInfinite)
    .build();

  return tx;
}

export async function simulateAndAssemble(params: {
  server: Server;
  tx: ReturnType<typeof TransactionBuilder.prototype.build>;
}) {
  const simulated = await params.server.simulateTransaction(params.tx);
  if (simulated.error) {
    throw new Error(`Simulation failed: ${simulated.error}`);
  }

  const assembled = params.server.assembleTransaction(params.tx, simulated).build();
  return { simulated, assembled };
}
