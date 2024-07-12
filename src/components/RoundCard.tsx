"use client"
import { connection, currencyMint, mint, programId } from "@/constants/solana";
import { Round } from "@/types";
import { Button, Input } from "@headlessui/react";
import { createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import moment from "moment";
import { FC, useCallback, useEffect, useState } from "react";
import IDL from '@/idl/fnet.json';
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { AnchorProvider, BN, Idl, Program, setProvider, utils } from "@coral-xyz/anchor";
import { PublicKey } from "@metaplex-foundation/js";
import { getSplTokenMetaData } from "@/utils/spl.utils";
import { TransactionMessage, VersionedTransaction } from "@solana/web3.js";


interface Props {
  round: Round | undefined;
};

const RoundCard: FC<Props> = ({ round }) => {
  const [volume, setVolume] = useState(0);
  const [amount, setAmount] = useState('0');

  const wallet = useAnchorWallet();

  const getVolume = useCallback(async () => {
    try {
      if (!round?.tokenAccount) return;
      const account = await getAccount(
        connection,
        round.tokenAccount,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
      console.log(account)
      setVolume(Number(account.amount) / (10 ** 6));
    } catch (e) {
      console.log(e)
    }
  }, [round])

  useEffect(() => {
    getVolume();
  }, [round])

  const buyToken = useCallback(async () => {
    try {
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
      const buyer = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("buyer"),
          wallet.publicKey.toBuffer()
        ],
        program.programId
      )[0];
      const userCurrencyAccount = getAssociatedTokenAddressSync(
        currencyMint,
        wallet.publicKey
      );
      const roundToken = round?.tokenAccount;
      const authority = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("authority"),
          mint.toBuffer()
        ],
        program.programId
      )[0];
      const currencyPot = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("currency-pot"),
          currencyMint.toBuffer()
        ],
        program.programId
      )[0];
      const instructions = [];
      const token = await getSplTokenMetaData(currencyMint.toBase58());
      const decimals = token?.decimals;
      if (round?.roundIndex === 1) {
        const firstRound = PublicKey.findProgramAddressSync(
          [
            utils.bytes.utf8.encode("first-round"),
            appState.toBuffer()
          ],
          program.programId
        )[0];
        const ixn = await program.methods.buyInFirstRound(new BN(Number(amount) * (10 ** Number(decimals)))).accounts({
          firstRound,
          appState,
          buyer,
          mint,
          currencyMint,
          userCurrencyAccount,
          firstRoundToken: roundToken,
          authority,
          currencyPot,
          tokenProgramMint: TOKEN_2022_PROGRAM_ID
        }).instruction();
        instructions.push(ixn);
      } else if (round?.roundIndex === 2) {
        const secondRound = PublicKey.findProgramAddressSync(
          [
            utils.bytes.utf8.encode("second-round"),
            appState.toBuffer()
          ],
          program.programId
        )[0];
        const ixn = await program.methods.buyInSecondRound(new BN(Number(amount) * (10 ** Number(decimals)))).accounts({
          secondRound,
          appState,
          buyer,
          mint,
          currencyMint,
          userCurrencyAccount,
          secondRoundToken: roundToken,
          authority,
          currencyPot,
          tokenProgramMint: TOKEN_2022_PROGRAM_ID
        }).instruction();
        instructions.push(ixn);
      } else if (round?.roundIndex === 3) {
        const thirdRound = PublicKey.findProgramAddressSync(
          [
            utils.bytes.utf8.encode("third-round"),
            appState.toBuffer()
          ],
          program.programId
        )[0];
        const ixn = await program.methods.buyInThirdRound(new BN(Number(amount) * (10 ** Number(decimals)))).accounts({
          thirdRound,
          appState,
          buyer,
          mint,
          currencyMint,
          userCurrencyAccount,
          thirdRoundToken: roundToken,
          authority,
          currencyPot,
          tokenProgramMint: TOKEN_2022_PROGRAM_ID
        }).instruction();
        instructions.push(ixn);
      }
      const { blockhash } = await connection.getLatestBlockhash();

      const message = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(message);
      const signedTxn = await wallet.signTransaction(transaction);
      await connection.sendTransaction(signedTxn);
    } catch (e) {
      console.log(e);
    }
  }, [wallet, round]);

  const unlock = useCallback(async () => {
    try {
      if (!wallet) throw new WalletNotConnectedError();
      const provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
      const program = new Program(IDL as Idl, programId);
      const buyer = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("buyer"),
          wallet.publicKey.toBuffer()
        ],
        program.programId
      )[0];
      const tokenAccount = getAssociatedTokenAddressSync(
        mint,
        wallet.publicKey,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
      const instructions = [];
      try {
        await getAccount(
          connection,
          tokenAccount,
          undefined,
          TOKEN_2022_PROGRAM_ID
        );
      } catch {
        const createAccountIxn = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          tokenAccount,
          wallet.publicKey,
          mint,
          TOKEN_2022_PROGRAM_ID
        );
        instructions.push(createAccountIxn);
      }
      const appState = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("app-state"),
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
      const roundToken = round?.tokenAccount;
      
      if (round?.roundIndex === 1) {
        const firstRound = PublicKey.findProgramAddressSync(
          [
            utils.bytes.utf8.encode("first-round"),
            appState.toBuffer()
          ],
          program.programId
        )[0];
        const ixn = await program.methods.unlockFirstRound().accounts({
          mint,
          buyer,
          tokenAccount,
          firstRound,
          appState,
          authority,
          firstRoundToken: roundToken,
          tokenProgram: TOKEN_2022_PROGRAM_ID
        }).instruction();
        instructions.push(ixn);
      } else if (round?.roundIndex === 2) {
        const secondRound = PublicKey.findProgramAddressSync(
          [
            utils.bytes.utf8.encode("second-round"),
            appState.toBuffer()
          ],
          program.programId
        )[0];
        const ixn = await program.methods.unlockSecondRound().accounts({
          mint,
          buyer,
          tokenAccount,
          secondRound,
          appState,
          authority,
          secondRoundToken: roundToken,
          tokenProgram: TOKEN_2022_PROGRAM_ID
        }).instruction();
        instructions.push(ixn);
      } else if (round?.roundIndex === 3) {
        const thirdRound = PublicKey.findProgramAddressSync(
          [
            utils.bytes.utf8.encode("third-round"),
            appState.toBuffer()
          ],
          program.programId
        )[0];
        const ixn = await program.methods.unlockThirdRound().accounts({
          mint,
          buyer,
          tokenAccount,
          thirdRound,
          appState,
          authority,
          thirdRoundToken: roundToken,
          tokenProgram: TOKEN_2022_PROGRAM_ID
        }).instruction();
        instructions.push(ixn);
      }
      const { blockhash } = await connection.getLatestBlockhash();

      const message = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(message);
      const signedTxn = await wallet.signTransaction(transaction);
      await connection.sendTransaction(signedTxn);
    } catch (e) {
      console.log(e);
    }
  }, [round, wallet]);

  const finalizeRound = useCallback(async () => {
    try {
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
      const authority = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("authority"),
          mint.toBuffer()
        ],
        program.programId
      )[0];
      const roundToken = round?.tokenAccount;
      const instructions = [];
      if (round?.roundIndex === 1) {
        const firstRound = PublicKey.findProgramAddressSync(
          [
            utils.bytes.utf8.encode("first-round"),
            appState.toBuffer()
          ],
          program.programId
        )[0];
        const ixn = await program.methods.finalizeFirstRound().accounts({
          appState,
          mint,
          authority,
          firstRoundToken: roundToken,
          firstRound
        }).instruction();
        instructions.push(ixn);
      } else if (round?.roundIndex === 2) {
        const secondRound = PublicKey.findProgramAddressSync(
          [
            utils.bytes.utf8.encode("second-round"),
            appState.toBuffer()
          ],
          program.programId
        )[0];
        const ixn = await program.methods.finalizeSecondRound().accounts({
          appState,
          mint,
          authority,
          secondRoundToken: roundToken,
          secondRound
        }).instruction();
        instructions.push(ixn);
      } else if (round?.roundIndex === 3) {
        const thirdRound = PublicKey.findProgramAddressSync(
          [
            utils.bytes.utf8.encode("third-round"),
            appState.toBuffer()
          ],
          program.programId
        )[0];
        const ixn = await program.methods.finalizeThirdRound().accounts({
          appState,
          mint,
          authority,
          thirdRoundToken: roundToken,
          thirdRound
        }).instruction();
        instructions.push(ixn);
      }
      const { blockhash } = await connection.getLatestBlockhash();

      const message = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(message);
      const signedTxn = await wallet.signTransaction(transaction);
      await connection.sendTransaction(signedTxn);
    } catch (e) {
      console.log(e)
    }
  }, [round, wallet])

  return !!round && (
    <div className="w-full border min-h-[300px] flex flex-col gap-4 p-4 rounded-xl">
      <div className="flex">
        <div className="flex-1">Round index</div>
        <div>{round.roundIndex}</div>
      </div>
      <div className="flex">
        <div className="flex-1">Start time</div>
        <div>{moment(new Date(Number(round.startTime) * 1000)).format('YYYY-MM-DD hh:mm:ss')}</div>
      </div>
      <div className="flex">
        <div className="flex-1">End time</div>
        <div>{moment(new Date(Number(round.endTime) * 1000)).format('YYYY-MM-DD hh:mm:ss')}</div>
      </div>
      <div className="flex">
        <div className="flex-1">Volume</div>
        <div>{volume}</div>
      </div>
      <div className="flex">
        <div className="flex-1">Buyer count</div>
        <div>{Number(round.buyerCount)}</div>
      </div>
      <div className="flex">
        <div className="flex-1">Total Collected</div>
        <div>{Number(round.totalCollected) / (10 ** 6)}</div>
      </div>
      <div className="flex">
        <div className="flex-1">Total Sold</div>
        <div>{Number(round.totalSold) / (10 ** 6)}</div>
      </div>
      <div>
        <Input
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="amount"
          className="w-full h-[35px] rounded-xl px-4 text-right text-black"
        />
      </div>
      <div>
        <Button
          onClick={buyToken}
          className="w-full h-[35px] rounded-xl bg-amber-500 font-semibold"
        >
          Buy
        </Button>
      </div>
      <div>
        <Button
          onClick={unlock}
          className="w-full h-[35px] rounded-xl bg-amber-500 font-semibold"
        >
          Claim
        </Button>
      </div>
      <div>
        <Button
          onClick={finalizeRound}
          className="w-full h-[35px] rounded-xl bg-amber-500 font-semibold"
        >
          Burn
        </Button>
      </div>
    </div>
  );
}

export default RoundCard;