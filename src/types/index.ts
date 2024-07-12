import { BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';


export interface Round {
  burned: boolean;
  buyerCount: BN;
  currency: {
    decimals: number;
    mint: PublicKey;
  },
  endTime: BN;
  roundIndex: number;
  startTime: BN;
  tokenAccount: PublicKey;
  totalCollected: BN;
  totalSold: BN;
}