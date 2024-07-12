import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import IDL from '@/idl/fnet.json';


export const mint = new PublicKey("FAsActK5Q6p82eY35og9nxGXCVkdTxpKeMBYmtKR8cXA");
export const currencyMint = new PublicKey("9W6V5qTxSawTTyhybKGCp4pCH9MGejn4Gd5yfzfbBMxg");

export const programId = new PublicKey(IDL.metadata.address);

export const connection = new Connection(clusterApiUrl('devnet'));

