"use client"
import { connection, mint, programId } from "@/constants/solana";
import { AnchorProvider, Idl, Program, setProvider, utils } from "@coral-xyz/anchor";
import { Button } from "@headlessui/react";
import { ExtensionType, TOKEN_2022_PROGRAM_ID, createInitializeMintInstruction, createInitializeTransferFeeConfigInstruction, getMintLen } from "@solana/spl-token";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import IDL from '@/idl/fnet.json';
import { tokenProgram } from "@metaplex-foundation/js";


const TokenPage = () => {
  const wallet = useAnchorWallet();
  const createMint = async () => {
    try {
      if (!wallet) throw new WalletNotConnectedError();
      const mintKeypair = Keypair.generate();
      const mint = mintKeypair.publicKey;
      console.log(mint.toBase58())
      const [authority, bump] = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("authority"),
          mint.toBuffer()
        ],
        programId
      );
      const extensions = [ExtensionType.TransferFeeConfig]
      const mintLength = getMintLen(extensions)

      const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLength);

      const instructions = [];

      const createAccountIxn = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: mintLength,
        lamports: mintLamports,
        programId: TOKEN_2022_PROGRAM_ID,
      });
      instructions.push(createAccountIxn);

      const configIxn = createInitializeTransferFeeConfigInstruction(
        mintKeypair.publicKey,
        wallet.publicKey,
        wallet.publicKey,
        0,
        BigInt(0),
        TOKEN_2022_PROGRAM_ID
      );
      instructions.push(configIxn);
      const initMintIxn = createInitializeMintInstruction(
        mintKeypair.publicKey,
        6,
        authority,
        authority,
        TOKEN_2022_PROGRAM_ID
      );
      instructions.push(initMintIxn);
      const provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
      const program = new Program(IDL as Idl, programId);
      const founderToken = Keypair.generate();
      const appState = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("app-state"),
          mint.toBuffer()
        ],
        program.programId
      )[0];
      const mintFounderIxn = await program.methods.mintFounder(9, bump).accounts({
        mint,
        founderToken: founderToken.publicKey,
        authority,
        appState,
        tokenProgram: TOKEN_2022_PROGRAM_ID
      }).signers([founderToken]).instruction();
      instructions.push(mintFounderIxn);
      const { blockhash } = await connection.getLatestBlockhash();

      const message = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(message);
      transaction.sign([founderToken, mintKeypair]);
      const signedTxn = await wallet.signTransaction(transaction);
      await connection.sendTransaction(signedTxn);
    } catch (e) {
      console.log(e);
    }
  }
  const mintOneYearToken = async () => {
    try {
      if (!wallet) throw new WalletNotConnectedError();
      const provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
      const program = new Program(IDL as Idl, programId);
      const oneYearToken = Keypair.generate();
      const appState = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("app-state"),
          mint.toBuffer()
        ],
        program.programId
      )[0];
      const [authority, bump] = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("authority"),
          mint.toBuffer()
        ],
        programId
      );
      const mintOneYearIxn = await program.methods.mintOneYear().accounts({
        mint,
        appState,
        oneYearToken: oneYearToken.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        authority
      }).signers([oneYearToken]).instruction();
      const instructions = [mintOneYearIxn];
      const { blockhash } = await connection.getLatestBlockhash();

      const message = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(message);
      transaction.sign([oneYearToken]);
      const signedTxn = await wallet.signTransaction(transaction);
      await connection.sendTransaction(signedTxn);
    } catch (e) {
      console.log(e);
    }
  }
  const mintSixYearToken = async () => {
    try {
      if (!wallet) throw new WalletNotConnectedError();
      const provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
      const program = new Program(IDL as Idl, programId);
      const sixYearToken = Keypair.generate();
      const appState = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("app-state"),
          mint.toBuffer()
        ],
        program.programId
      )[0];
      const [authority, bump] = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("authority"),
          mint.toBuffer()
        ],
        programId
      );
      const mintSixYearIxn = await program.methods.mintSixYear().accounts({
        mint,
        appState,
        sixYearToken: sixYearToken.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        authority,
      }).signers([sixYearToken]).instruction();
      const instructions = [mintSixYearIxn];
      const { blockhash } = await connection.getLatestBlockhash();

      const message = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(message);
      transaction.sign([sixYearToken]);
      const signedTxn = await wallet.signTransaction(transaction);
      await connection.sendTransaction(signedTxn);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="container">
      <div className="w-full flex flex-col gap-4">
        <div>
          <Button
            onClick={createMint}
            className="w-full h-[50px] bg-neutral-800 rounded-full"
          >
            Create Token
          </Button>
        </div>
        <div>
          <Button
            onClick={mintOneYearToken}
            className="w-full h-[50px] bg-neutral-800 rounded-full"
          >
            Mint for 1 year lock
          </Button>
        </div>
        <div>
          <Button
            onClick={mintSixYearToken}
            className="w-full h-[50px] bg-neutral-800 rounded-full"
          >
            Mint for 6 years lock
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TokenPage;