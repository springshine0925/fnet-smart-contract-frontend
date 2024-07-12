"use client"

import { connection, mint, programId } from "@/constants/solana";
import { AnchorProvider, Idl, Program, setProvider, utils } from "@coral-xyz/anchor";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import IDL from '@/idl/fnet.json';
import { PublicKey } from "@metaplex-foundation/js";
import { Round } from "@/types";
import RoundCard from "@/components/RoundCard";

const ListPage = () => {
  const [round1, setRound1] = useState<Round>();
  const [round2, setRound2] = useState<Round>();
  const [round3, setRound3] = useState<Round>();


  const wallet = useAnchorWallet();

  const getRounds = useCallback(async () => {
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
      const firstRound = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("first-round"),
          appState.toBuffer()
        ],
        program.programId
      )[0];
      const roundone = await program.account.round.fetch(firstRound);
      setRound1(roundone as unknown as Round);
      const secondRound = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("second-round"),
          appState.toBuffer()
        ],
        program.programId
      )[0];
      const roundtwo = await program.account.round.fetch(secondRound);
      setRound2(roundtwo as unknown as Round);
      const thirdRound = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("third-round"),
          appState.toBuffer()
        ],
        program.programId
      )[0];
      const roundthree = await program.account.round.fetch(thirdRound);
      setRound3(roundthree as unknown as Round);
    } catch (e) {
      console.log(e);
    }
  }, [wallet]);

  useEffect(() => {
    getRounds();
  }, [wallet]);
  return (
    <div className="container">
      <div className="w-full grid grid-cols-3 gap-4">
        <RoundCard round={round1}/>
        <RoundCard round={round2}/>
        <RoundCard round={round3} />
      </div>
    </div>
  );
}

export default ListPage;