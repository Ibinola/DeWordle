import { Keypair, nativeToScVal } from "@stellar/stellar-sdk";
import { Server } from "@stellar/stellar-sdk/rpc";
import type { DayConfig, GuessResult, Session, SubmitGuessInput } from "./types";
import type { SorobanNetworkConfig } from "./network";
import { buildContractTx, simulateAndAssemble } from "./tx-builder";

export interface CoreGameClientOptions {
  contractId: string;
  network: SorobanNetworkConfig;
}

export class CoreGameClient {
  private readonly server: Server;

  constructor(private readonly options: CoreGameClientOptions) {
    this.server = new Server(options.network.rpcUrl);
  }

  get contractId() {
    return this.options.contractId;
  }

  async buildCreateSessionTx(sourcePublicKey: string, dayId: number, nonce: number) {
    const account = await this.server.getAccount(sourcePublicKey);

    const tx = await buildContractTx({
      server: this.server,
      source: account,
      network: this.options.network,
      contractId: this.options.contractId,
      method: "create_session",
      args: [nativeToScVal(sourcePublicKey), nativeToScVal(dayId), nativeToScVal(nonce)],
    });

    return simulateAndAssemble({ server: this.server, tx });
  }

  async buildSubmitGuessTx(sourcePublicKey: string, input: SubmitGuessInput) {
    const account = await this.server.getAccount(sourcePublicKey);

    const tx = await buildContractTx({
      server: this.server,
      source: account,
      network: this.options.network,
      contractId: this.options.contractId,
      method: "submit_guess",
      args: [
        nativeToScVal(input.player),
        nativeToScVal(input.sessionId),
        nativeToScVal(input.guessCommitment),
        nativeToScVal(input.outcomeCode),
        nativeToScVal(input.isCorrect),
      ],
    });

    return simulateAndAssemble({ server: this.server, tx });
  }

  // Placeholder read methods for future generated bindings
  async getDayConfig(_dayId: number): Promise<DayConfig | null> {
    return null;
  }

  async getSession(_sessionId: string): Promise<Session | null> {
    return null;
  }

  async parseGuessResult(_raw: unknown): Promise<GuessResult | null> {
    return null;
  }
}

export function generateEphemeralSigner() {
  return Keypair.random();
}
