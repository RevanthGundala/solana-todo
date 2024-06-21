"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { program } from "@/utils/anchor/setup";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { createClient } from "@/utils/supabase/client";
import { PublicKey } from "@solana/web3.js";
import { TodoAppData } from "@/utils/anchor/setup";

export default function Todos() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const supabase = createClient();
  const [todos, setTodos] = useState<TodoAppData[]>([]);
  const [newTodo, setNewTodo] = useState<TodoAppData>({
    id: new BN(0),
    title: "",
    description: "",
    dueDate: "",
    isCompleted: false,
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!publicKey) return;
    const fetchTodos = async () => {
      // const { data: todos, error } = await supabase
      //   .from("todos")
      //   .select("todo_id,public_key");
      // // TODO:
      // console.log(todos);
      // if (error) console.error(error);
      // const userTodoIds = todos?.filter(
      //   (todo) => todo.public_key === publicKey.toString()
      // );
      const [userAccountPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_account"), publicKey.toBuffer()],
        program.programId
      );
      const userAccount = await program.account.userAccount.fetch(
        userAccountPda
      );
      setTodos(userAccount.todos);
    };
    fetchTodos();
  }, [publicKey, todos]);

  const handleAddTodo = async () => {
    if (newTodo.title.trim() !== "") {
      let tx;
      const { id, title, description, dueDate, isCompleted } = newTodo;
      if (id) {
        // Update todo call
        tx = await program.methods
          .updateTodo(new BN(id!), title, description, dueDate, isCompleted)
          .transaction();
      } else {
        // Add todo call
        tx = await program.methods
          .addTodo(title, description, dueDate)
          .transaction();
      }
      const txReceipt = await sendTransaction(tx, connection);
      console.log(txReceipt);
      // TODO: Update the todos state with the new todo id
      const updated_id = new BN(0);
      const { error } = await supabase
        .from("todos")
        .upsert([{ todo_id: updated_id, public_key: publicKey?.toString() }])
        .select();
      if (error) console.error(error);

      setNewTodo({
        id: new BN(0),
        title: "",
        description: "",
        dueDate: "",
        isCompleted: false,
      });
      setShowModal(false);
    }
  };
  const handleToggleTodo = (id: BN) => {
    setTodos(
      todos
        .map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.isCompleted } : todo
        )
        .sort((a, b) => {
          if (a.isCompleted && !b.isCompleted) {
            return 1;
          } else if (!a.isCompleted && b.isCompleted) {
            return -1;
          } else {
            return 0;
          }
        })
    );
  };
  const handleDeleteTodo = async (id: BN) => {
    const tx = await program.methods.deleteTodo(new BN(id)).transaction();
    const txReceipt = await sendTransaction(tx, connection);
    console.log(txReceipt);
  };
  const handleEditTodo = (todo: TodoAppData) => {
    setNewTodo(todo);
    setShowModal(true);
  };

  return (
    <section className="container mx-auto my-8 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Todos</h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowModal(true)}>Add Todo</Button>
        </div>
      </div>
      <div className="mt-4 grid gap-4">
        {todos.map((todo, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-md bg-gray-100 p-4 dark:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.isCompleted}
                onCheckedChange={() => handleToggleTodo(todo.id!)}
              />
              <div>
                <h3
                  className={`text-gray-900 dark:text-gray-50 ${
                    todo.isCompleted
                      ? "line-through text-gray-500 dark:text-gray-400"
                      : ""
                  }`}
                >
                  {todo.title}
                </h3>
                <p
                  className={`text-gray-500 dark:text-gray-400 ${
                    todo.isCompleted ? "line-through" : ""
                  }`}
                >
                  {todo.description}
                </p>
                <p
                  className={`text-gray-500 dark:text-gray-400 ${
                    todo.isCompleted ? "line-through" : ""
                  }`}
                >
                  Due: {todo.dueDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                onClick={() => handleEditTodo(todo)}
              >
                <FilePenIcon className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
                onClick={() => handleDeleteTodo(todo.id!)}
              >
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {newTodo.id ? "Edit Todo" : "Add a New Todo"}
            </DialogTitle>
            <DialogDescription>
              {newTodo.id
                ? "Update the details for this todo."
                : "Fill out the details for your new todo."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newTodo.description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={newTodo.dueDate}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, dueDate: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddTodo}>
              {newTodo.id ? "Update Todo" : "Add Todo"}
            </Button>
            <div>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function FilePenIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
