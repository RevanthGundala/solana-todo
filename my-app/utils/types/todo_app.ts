/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/todo_app.json`.
 */
export type TodoApp = {
  address: "9pXHHqYqYvUn1M7rqFVG7WJXZWez9ZDBgkoTCsQPLdM8";
  metadata: {
    name: "todoApp";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "addTodo";
      discriminator: [188, 16, 45, 145, 4, 5, 188, 75];
      accounts: [
        {
          name: "userAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "user";
          writable: true;
          signer: true;
        }
      ];
      args: [
        {
          name: "title";
          type: "string";
        },
        {
          name: "description";
          type: "string";
        },
        {
          name: "dueDate";
          type: "string";
        }
      ];
    },
    {
      name: "deleteTodo";
      discriminator: [224, 212, 234, 177, 90, 57, 219, 115];
      accounts: [
        {
          name: "userAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "user";
          writable: true;
          signer: true;
        }
      ];
      args: [
        {
          name: "id";
          type: "u64";
        }
      ];
    },
    {
      name: "initializeUser";
      discriminator: [111, 17, 185, 250, 60, 122, 38, 254];
      accounts: [
        {
          name: "userAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "updateTodo";
      discriminator: [105, 8, 31, 183, 159, 73, 203, 134];
      accounts: [
        {
          name: "userAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "user";
          writable: true;
          signer: true;
        }
      ];
      args: [
        {
          name: "id";
          type: "u64";
        },
        {
          name: "title";
          type: {
            option: "string";
          };
        },
        {
          name: "description";
          type: {
            option: "string";
          };
        },
        {
          name: "dueDate";
          type: {
            option: "string";
          };
        },
        {
          name: "isCompleted";
          type: {
            option: "bool";
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "userAccount";
      discriminator: [211, 33, 136, 16, 186, 110, 242, 127];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "todoNotFound";
      msg: "Todo not found";
    }
  ];
  types: [
    {
      name: "todo";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u64";
          },
          {
            name: "title";
            type: "string";
          },
          {
            name: "description";
            type: "string";
          },
          {
            name: "dueDate";
            type: "string";
          },
          {
            name: "isCompleted";
            type: "bool";
          }
        ];
      };
    },
    {
      name: "userAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "todos";
            type: {
              vec: {
                defined: {
                  name: "todo";
                };
              };
            };
          }
        ];
      };
    }
  ];
};
