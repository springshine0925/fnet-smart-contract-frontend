import { TOKEN_2022_PROGRAM_ID, getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";

const connection = new Connection(clusterApiUrl('devnet'));


export const getSplTokenBalance = async (mint: PublicKey, address: PublicKey) => {
  try {
    const tokenAccount = getAssociatedTokenAddressSync(
      mint,
      address
    );
    const tokenAccountInfo = await getAccount(
      connection,
      tokenAccount
    );
    return Number(tokenAccountInfo.amount);
  } catch {
    try {
      const tokenAccount = getAssociatedTokenAddressSync(
        mint,
        address,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
      const tokenAccountInfo = await getAccount(
        connection,
        tokenAccount,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
      return Number(tokenAccountInfo.amount);
    } catch {
      return 0
    }

  }
}

export const getSplTokenMetaData = async (mint: string) => {
  try {
    const mintAddress = new PublicKey(mint);
    const metaplex = Metaplex.make(connection);

    const token = await metaplex.nfts().findByMint({ mintAddress });

    if (!!token) {
      return {
        name: token.name,
        symbol: token.symbol,
        logo: token?.json?.image || '',
        mint,
        decimals: token.mint.currency.decimals || 0,
        tokenStandard: token.tokenStandard
      }
    } else {
      return {
        name: 'Unknown',
        symbol: 'Unknown',
        logo: '',
        mint,
        decimals: 0,
      };
    }
  } catch {
    return null;
  }
}

export function hexToNum(hexstring: string | undefined) {
  return Number(`0x${hexstring}`);
}