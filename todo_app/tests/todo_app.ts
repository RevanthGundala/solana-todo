import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoApp } from "../target/types/todo_app";
import { PublicKey } from "@solana/web3.js";
import { assert } from "chai";

describe("todo_app", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TodoApp as Program<TodoApp>;

  let userAccountPda: PublicKey;
  let bump: number;

  before(async () => {
    // Derive the PDA for the user account.
    [userAccountPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_account"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    // Initialize the user account.
    await program.methods.initializeUser().rpc();
  });

  it("Initializes User", async () => {
    // Add your test here.
    const userAccount = await program.account.userAccount.fetch(userAccountPda);
    assert.isArray(userAccount.todos);
    assert.lengthOf(userAccount.todos, 0);
  });
});
