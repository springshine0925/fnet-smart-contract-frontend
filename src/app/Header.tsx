"use client"
import { URLS } from "@/constants/links";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { FC } from "react";


interface Props {}

const Header:FC<Props> = () => {
  return (
    <div className="w-full">
      <div className="container flex justify-end h-[80px] items-center">
        <div className="flex-1 flex justify-start gap-4 font-semibold">
          <Link href={URLS.tokens}>
            Token
          </Link>
          <Link href={URLS.createPresale}>
            Create Presale
          </Link>
          <Link href={URLS.presaleList}>
            Presale List
          </Link>
        </div>
        <WalletMultiButton />
      </div>
    </div>
  )
}

export default Header;