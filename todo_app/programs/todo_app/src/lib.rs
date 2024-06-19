use anchor_lang::prelude::*;

declare_id!("9pXHHqYqYvUn1M7rqFVG7WJXZWez9ZDBgkoTCsQPLdM8");
#[program]
pub mod todo_app {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        user_account.todos = vec![];
        Ok(())
    }

    pub fn add_todo(ctx: Context<AddTodo>, title: String, description: String, due_date: String) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let id = user_account.todos.len() as u64;
        let todo = Todo {
            id,
            title,
            description,
            due_date,
            is_completed: false,
        };
        user_account.todos.push(todo);
        Ok(())
    }

    pub fn update_todo(ctx: Context<UpdateTodo>, id: u64, title: Option<String>, description: Option<String>, due_date: Option<String>, is_completed: Option<bool>) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let todo = user_account.todos.iter_mut().find(|t| t.id == id).ok_or(ErrorCode::TodoNotFound)?;
        if let Some(title) = title { todo.title = title; }
        if let Some(description) = description { todo.description = description; }
        if let Some(due_date) = due_date { todo.due_date = due_date; }
        if let Some(is_completed) = is_completed { todo.is_completed = is_completed; }
        Ok(())
    }

    pub fn delete_todo(ctx: Context<DeleteTodo>, id: u64) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        msg!("id: {}", id);
        let index = user_account.todos.iter().position(|t| t.id == id).ok_or(ErrorCode::TodoNotFound)?;
        msg!("index: {}", index);
        user_account.todos.remove(index);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(init, payer = user, space = 8 + 1024, seeds=[b"user_account", user.key().as_ref()], bump)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct AddTodo<'info> {
    #[account(mut, seeds=[b"user_account", user.key().as_ref()], bump)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateTodo<'info> {
    #[account(mut, seeds=[b"user_account", user.key().as_ref()], bump)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteTodo<'info> {
    #[account(mut, seeds=[b"user_account", user.key().as_ref()], bump)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct UserAccount { 
    pub todos: Vec<Todo>, 
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Todo { 
    pub id: u64,
    pub title: String,
    pub description: String,
    pub due_date: String,
    pub is_completed: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Todo not found")]
    TodoNotFound,
}
