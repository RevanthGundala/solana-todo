import { IdlAccounts, Program } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { IDL, TodoApp } from "./idl";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const program = new Program<TodoApp>(IDL, { connection });

export type TodoAppData = IdlAccounts<TodoApp>["userAccount"]["todos"][0];
