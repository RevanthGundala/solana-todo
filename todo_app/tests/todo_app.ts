import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoApp } from "../target/types/todo_app";
import { assert } from "chai";

describe("todo_app", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TodoApp as Program<TodoApp>;

  let userAccountPda: anchor.web3.PublicKey;
  let user: anchor.web3.Keypair;

  before(async () => {
    user = anchor.web3.Keypair.generate();

    const signature = await provider.connection.requestAirdrop(
      user.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
    // Derive the PDA for the user account.
    [userAccountPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_account"), user.publicKey.toBuffer()],
      program.programId
    );
    // Initialize the user account.
    await program.methods
      .initializeUser()
      .accounts({
        userAccount: userAccountPda,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();
  });

  it("Initializes User", async () => {
    // Add your test here.
    const userAccount = await program.account.userAccount.fetch(userAccountPda);
    assert.isArray(userAccount.todos);
    assert.lengthOf(userAccount.todos, 0);
  });

  it("Adds Todo", async () => {
    // Add your test here.
    await program.methods
      .addTodo("first todo", "test desc", "tomorrow")
      .accounts({
        userAccount: userAccountPda,
        user: user.publicKey,
      })
      .signers([user])
      .rpc();
    const userAccount = await program.account.userAccount.fetch(userAccountPda);

    assert.lengthOf(userAccount.todos, 1);
    assert.equal(userAccount.todos[0].id, 0);
    assert.equal(userAccount.todos[0].title, "first todo");
    assert.equal(userAccount.todos[0].description, "test desc");
    assert.equal(userAccount.todos[0].dueDate, "tomorrow");
  });

  it("Updates Todo", async () => {
    await program.methods
      .updateTodo(
        new anchor.BN(0),
        "updated todo",
        "updated desc",
        "today",
        true
      )
      .accounts({
        userAccount: userAccountPda,
        user: user.publicKey,
      })
      .signers([user])
      .rpc();
    const userAccount = await program.account.userAccount.fetch(userAccountPda);
    assert.lengthOf(userAccount.todos, 1);
    assert.equal("updated todo", userAccount.todos[0].title);
    assert.equal("updated desc", userAccount.todos[0].description);
    assert.equal("today", userAccount.todos[0].dueDate);
    assert.equal(true, userAccount.todos[0].isCompleted);
  });

  it("Adds and Deletes Todo", async () => {
    const userAccount = await program.account.userAccount.fetch(userAccountPda);
    const addTodoInstruction = await program.methods
      .addTodo("first todo", "test desc", "tomorrow")
      .accounts({
        userAccount: userAccountPda,
        user: user.publicKey,
      })
      .instruction();

    const deleteTodoInstruction = await program.methods
      .deleteTodo(new anchor.BN(0))
      .accounts({
        userAccount: userAccountPda,
        user: user.publicKey,
      })
      .instruction();

    const transaction = new anchor.web3.Transaction()
      .add(addTodoInstruction)
      .add(deleteTodoInstruction);

    await provider.connection.sendTransaction(transaction, [user]);

    assert.lengthOf(userAccount.todos, 1);
  });
});
