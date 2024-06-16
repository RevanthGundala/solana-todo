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

type Todo = {
  id: number | null;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
};

export default function Component() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      title: "Buy groceries",
      description: "Pick up milk, eggs, and bread",
      dueDate: "2023-05-15",
      completed: false,
    },
    {
      id: 2,
      title: "Finish project report",
      description: "Complete the quarterly report for the team",
      dueDate: "2023-05-20",
      completed: false,
    },
    {
      id: 3,
      title: "Call mom",
      description: "Catch up with mom and see how she is doing",
      dueDate: "2023-05-18",
      completed: false,
    },
  ]);
  const [newTodo, setNewTodo] = useState<Todo>({
    id: null,
    title: "",
    description: "",
    dueDate: "",
    completed: false,
  });
  const [showModal, setShowModal] = useState(false);

  // TODO: when updating, delete and add old todo or figure out how to update in place
  useEffect(() => {}, []);

  const handleAddTodo = (update = false) => {
    if (newTodo.title.trim() !== "") {
      // TODO: add func calls add, update, and get
      if (update) {
      } else {
      }
      setNewTodo({
        id: null,
        title: "",
        description: "",
        dueDate: "",
        completed: false,
      });
      setShowModal(false);
    }
  };
  const handleToggleTodo = (id: number) => {
    setTodos(
      todos
        .map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
        .sort((a, b) => {
          if (a.completed && !b.completed) {
            return 1;
          } else if (!a.completed && b.completed) {
            return -1;
          } else {
            return 0;
          }
        })
    );
  };
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  const handleEditTodo = (todo: Todo) => {
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
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between rounded-md bg-gray-100 p-4 dark:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() => handleToggleTodo(todo.id!)}
              />
              <div>
                <h3
                  className={`text-gray-900 dark:text-gray-50 ${
                    todo.completed
                      ? "line-through text-gray-500 dark:text-gray-400"
                      : ""
                  }`}
                >
                  {todo.title}
                </h3>
                <p
                  className={`text-gray-500 dark:text-gray-400 ${
                    todo.completed ? "line-through" : ""
                  }`}
                >
                  {todo.description}
                </p>
                <p
                  className={`text-gray-500 dark:text-gray-400 ${
                    todo.completed ? "line-through" : ""
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
            <Button
              type="button"
              onClick={() =>
                newTodo.id ? handleAddTodo(true) : handleAddTodo()
              }
            >
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
