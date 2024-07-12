"use client"
import { connection, currencyMint, mint, programId } from "@/constants/solana";
import { AnchorProvider, BN, Idl, Program, setProvider, utils } from "@coral-xyz/anchor";
import { Button, Input } from "@headlessui/react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useCallback, useState } from "react";
import IDL from '@/idl/fnet.json';
import { Keypair, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { getSplTokenMetaData } from "@/utils/spl.utils";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";


const CreatePresalePage = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const wallet = useAnchorWallet();

  const createFirstRound = useCallback(async () => {
    if (!wallet) throw new WalletNotConnectedError();
    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);
    const program = new Program(IDL as Idl, programId);
    const appState = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("app-state"),
        mint.toBuffer()
      ],
      program.programId
    )[0];
    const firstRound = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("first-round"),
        appState.toBuffer()
      ],
      program.programId
    )[0];
    const authority = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("authority"),
        mint.toBuffer()
      ],
      program.programId
    )[0];
    const firstRoundToken = Keypair.generate();
    const start = new BN(Math.floor(new Date(startTime).getTime() / 1000));
    const end = new BN(Math.floor(new Date(endTime).getTime() / 1000));
    const tokenMetadata = await getSplTokenMetaData("9W6V5qTxSawTTyhybKGCp4pCH9MGejn4Gd5yfzfbBMxg")

    const createRoundIxn = await program.methods.createFirstRound(
      start,
      end,
    ).accounts({
      appState,
      mint,
      currencyMint,
      authority,
      firstRound,
      firstRoundToken: firstRoundToken.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID
    }).signers([firstRoundToken]).instruction();
    const instructions = [createRoundIxn];
    const { blockhash } = await connection.getLatestBlockhash();

    const message = new TransactionMessage({
      payerKey: wallet.publicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(message);

    transaction.sign([firstRoundToken]);

    const signedTxn = await wallet.signTransaction(transaction);

    await connection.sendTransaction(signedTxn);
  }, [startTime, endTime, wallet]);


  const createSecondRound = useCallback(async () => {
    if (!wallet) throw new WalletNotConnectedError();
    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);
    const program = new Program(IDL as Idl, programId);
    const appState = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("app-state"),
        mint.toBuffer()
      ],
      program.programId
    )[0];
    const secondRound = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("second-round"),
        mint.toBuffer()
      ],
      program.programId
    )[0];
    const authority = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("authority"),
        mint.toBuffer()
      ],
      program.programId
    )[0];
    const secondRoundToken = Keypair.generate();
    const start = new BN(Math.floor(new Date(startTime).getTime() / 1000));
    const end = new BN(Math.floor(new Date(endTime).getTime() / 1000));
    const tokenMetadata = await getSplTokenMetaData("9W6V5qTxSawTTyhybKGCp4pCH9MGejn4Gd5yfzfbBMxg")

    const createRoundIxn = await program.methods.createSecondRound(
      start,
      end,
    ).accounts({
      appState,
      mint,
      currencyMint,
      authority,
      secondRound,
      secondRoundToken: secondRoundToken.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID
    }).signers([secondRoundToken]).instruction();
    const instructions = [createRoundIxn];
    const { blockhash } = await connection.getLatestBlockhash();

    const message = new TransactionMessage({
      payerKey: wallet.publicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(message);

    transaction.sign([secondRoundToken]);

    const signedTxn = await wallet.signTransaction(transaction);

    await connection.sendTransaction(signedTxn);
  }, [startTime, endTime, wallet]);

  const createThirdRound = useCallback(async () => {
    if (!wallet) throw new WalletNotConnectedError();
    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);
    const program = new Program(IDL as Idl, programId);
    const appState = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("app-state"),
        mint.toBuffer()
      ],
      program.programId
    )[0];
    const thirdRound = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("third-round"),
        mint.toBuffer()
      ],
      program.programId
    )[0];
    const authority = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("authority"),
        mint.toBuffer()
      ],
      program.programId
    )[0];
    const thirdRoundToken = Keypair.generate();
    const start = new BN(Math.floor(new Date(startTime).getTime() / 1000));
    const end = new BN(Math.floor(new Date(endTime).getTime() / 1000));
    const tokenMetadata = await getSplTokenMetaData("9W6V5qTxSawTTyhybKGCp4pCH9MGejn4Gd5yfzfbBMxg")

    const createRoundIxn = await program.methods.createThirdRound(
      start,
      end,
    ).accounts({
      appState,
      mint,
      currencyMint,
      authority,
      thirdRound,
      thirdRoundToken: thirdRoundToken.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID
    }).signers([thirdRoundToken]).instruction();
    const instructions = [createRoundIxn];
    const { blockhash } = await connection.getLatestBlockhash();

    const message = new TransactionMessage({
      payerKey: wallet.publicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(message);

    transaction.sign([thirdRoundToken]);

    const signedTxn = await wallet.signTransaction(transaction);

    await connection.sendTransaction(signedTxn);
  }, [startTime, endTime, wallet]);

  return (
    <div className="container flex flex-col gap-4">
      <div className="font-semibold text-xl">Create Presale</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div>
            Start time
          </div>
          <Input
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            type="datetime-local"
            className="w-full h-[40px] rounded-xl text-black px-4"
          />
        </div>
        <div>
          <div>
            End time
          </div>
          <Input
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            type="datetime-local"
            className="w-full h-[40px] rounded-xl text-black px-4"
          />
        </div>
      </div>
      <div>
        <Button
          onClick={createFirstRound}
          className="w-full h-[45px] bg-neutral-600 rounded-full"
        >
          Create First Round
        </Button>
      </div>
      <div>
        <Button
          onClick={createSecondRound}
          className="w-full h-[45px] bg-neutral-600 rounded-full"
        >
          Create Second Round
        </Button>
      </div>
      <div>
        <Button
          onClick={createThirdRound}
          className="w-full h-[45px] bg-neutral-600 rounded-full"
        >
          Create Third Round
        </Button>
      </div>
    </div>
  );
}

export default CreatePresalePage;