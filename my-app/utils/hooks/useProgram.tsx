import { useAnchorWallet, AnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Program } from "@coral-xyz/anchor";
import idl from "../idl/todo_app.json";
import { TodoApp } from "../types/todo_app";

export function useProgram() {
  let isConnected = false;
  let publicKey = null;
  const wallet = useAnchorWallet();
  if (wallet) {
    isConnected = true;
    publicKey = wallet.publicKey;
  }
  const { connection } = useConnection();
  const provider = new AnchorProvider(
    connection,
    wallet as unknown as AnchorWallet,
    {}
  );
  const program = new Program<TodoApp>(idl as TodoApp, provider);
  return { program, publicKey, isConnected, provider };
}
